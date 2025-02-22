import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function useProgress(quizId: Id<"quiz">) {
  const progress = useQuery(api.progress.getCurrentProgress, { quizId });
  return progress;
}

export function useAllProgress() {
  const progress = useQuery(api.progress.getAllProgress);
  return progress;
}
