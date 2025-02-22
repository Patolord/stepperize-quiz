import { query } from "./_generated/server";
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

// Get all progress records
export const getAllProgressByQuizId = query({
  args: { quizId: v.id("quiz") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("progress")
      .withIndex("by_quiz", (q) => q.eq("quizId", args.quizId))
      .order("desc")
      .collect();
  },
});

// Get all progress records
export const getAllProgress = query({
  handler: async (ctx) => {
    return await ctx.db.query("progress").collect();
  },
});
