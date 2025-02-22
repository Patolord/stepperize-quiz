import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    title: v.string(),
    question: v.string(),
    options: v.array(v.string()),
    correctAnswerIndex: v.optional(v.number()),
    explanation: v.optional(v.string()),
  }),
  quiz: defineTable({
    title: v.string(),
    questions: v.array(v.id("questions")),
  }),

  progress: defineTable({
    quizId: v.id("quiz"),
    currentQuestionIndex: v.number(),
    answers: v.array(v.number()),
    answerFeedback: v.array(
      v.object({
        isCorrect: v.boolean(),
        explanation: v.optional(v.string()),
      })
    ),
    isComplete: v.boolean(),
  }).index("by_quiz", ["quizId"]),
});
