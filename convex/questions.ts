import { Doc } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export type SafeQuestion = {
  _id: Doc<"questions">["_id"];
  _creationTime: Doc<"questions">["_creationTime"];
  title: string;
  question: string;
  options: string[];
};

// Utility function to prepare question data for client
function sanitizeQuestionForClient(question: Doc<"questions">): SafeQuestion {
  const safeQuestion = {
    _id: question._id,
    _creationTime: question._creationTime,
    title: question.title,
    question: question.question,
    options: question.options,
  };
  return safeQuestion;
}

export const getQuizData = query({
  args: { quizId: v.id("quiz") },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Get all questions and sanitize them
    const safeQuestions: SafeQuestion[] = await Promise.all(
      quiz.questions.map(async (questionId) => {
        const question = await ctx.db.get(questionId);
        if (!question) throw new Error("Question not found");
        return sanitizeQuestionForClient(question);
      })
    );

    return {
      ...quiz,
      questions: safeQuestions,
    };
  },
});

export const startQuiz = mutation({
  args: { quizId: v.id("quiz") },
  handler: async (ctx, args) => {
    return await ctx.db.insert("progress", {
      quizId: args.quizId,
      currentQuestionIndex: 0,
      answers: [],
      isComplete: false,
      answerFeedback: [],
    });
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

export const getQuizzes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quiz").collect();
  },
});
