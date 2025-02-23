"use client";

import { Id } from "../../convex/_generated/dataModel";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizStepper } from "./QuizStepper";

interface QuizProps {
  quizId: Id<"quiz">;
}

export function Quiz({ quizId }: QuizProps) {
  const { quizData, progress, submitAnswer } = useQuiz(quizId);

  if (!quizData || !progress) return null;

  return (
    <QuizStepper
      quizData={quizData}
      progress={progress}
      onSubmitAnswer={submitAnswer}
    />
  );
}
