import { Quiz } from "@/components/Quiz";
import { Id } from "../../../../convex/_generated/dataModel";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: Id<"quiz"> }>;
}) {
  const quizId = (await params).quizId;
  return <Quiz quizId={quizId} />;
}
