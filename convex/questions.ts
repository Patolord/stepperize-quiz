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

export const getQuizzes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quiz").collect();
  },
});
