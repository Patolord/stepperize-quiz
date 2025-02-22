import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useQuizResults(quizId: Id<"quiz">) {
  const results = useQuery(api.questions.getQuizResults, { quizId });
  return results;
}
