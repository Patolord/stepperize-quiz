import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get current progress for a quiz
export const getCurrentProgress = query({
  args: { quizId: v.id("quiz") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progress")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .order("desc")
      .first();
  },
});

export const submitAnswerAndProgress = mutation({
  args: {
    quizId: v.id("quiz"),
    selectedOptionIndex: v.union(
      v.literal(0),
      v.literal(1),
      v.literal(2),
      v.literal(3)
    ),
  },
  handler: async (ctx, args) => {
    const currentProgress = await ctx.db
      .query("progress")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .order("desc")
      .first();

    if (!currentProgress) throw new Error("No active quiz progress found");
    if (currentProgress.isComplete) throw new Error("Quiz is already complete");

    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");

    const currentQuestionId =
      quiz.questions[currentProgress.currentQuestionIndex];
    const currentQuestion = await ctx.db.get(currentQuestionId);
    if (!currentQuestion) throw new Error("Question not found");

    const isAnswerCorrect =
      currentQuestion.correctAnswerIndex === args.selectedOptionIndex;

    const nextQuestionIndex = currentProgress.currentQuestionIndex + 1;
    const isQuizComplete = nextQuestionIndex >= quiz.questions.length;

    // Store answer with feedback
    await ctx.db.patch(currentProgress._id, {
      currentQuestionIndex: nextQuestionIndex,
      answers: [...currentProgress.answers, args.selectedOptionIndex],
      answerFeedback: [
        ...(currentProgress.answerFeedback ?? []),
        {
          isCorrect: isAnswerCorrect,
          explanation: currentQuestion.explanation,
        },
      ],
      isComplete: isQuizComplete,
    });

    return {
      isAnswerCorrect,
      isComplete: isQuizComplete,
      feedback: isAnswerCorrect
        ? "Correct! Well done!"
        : "Incorrect. Try again!",
      explanation: currentQuestion.explanation,
      nextQuestionIndex,
    };
  },
});

// Get all progress records
export const getAllProgress = query({
  handler: async (ctx) => {
    return await ctx.db.query("progress").collect();
  },
});
