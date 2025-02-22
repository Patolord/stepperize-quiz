import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { type SafeQuestion } from "../../convex/questions";

export type SafeQuiz = {
  _id: Id<"quiz">;
  title: string;
  description?: string;
  questions: SafeQuestion[];
};

export function useQuiz(quizId: Id<"quiz">) {
  const quizData = useQuery(api.questions.getQuizData, { quizId });
  const progress = useQuery(api.questions.getCurrentProgress, { quizId });

  const startQuiz = useMutation(api.questions.startQuiz);
  const submitAnswer = useMutation(api.questions.submitAnswerAndProgress);

  return {
    quizData,
    progress,
    startQuiz: () => startQuiz({ quizId }),
    submitAnswer: (selectedOptionIndex: 0 | 1 | 2 | 3) =>
      submitAnswer({ quizId, selectedOptionIndex }),
    isLoading: quizData === undefined || progress === undefined,
  };
}

export function useQuizzes() {
  const quizzes = useQuery(api.questions.getQuizzes);
  return quizzes;
}
