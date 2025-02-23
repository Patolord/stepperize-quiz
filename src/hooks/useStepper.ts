import { ReactElement } from "react";
import { defineStepper } from "@stepperize/react";
import { SafeQuiz } from "./useQuiz";

interface StepperQuestion {
  id: string;
  title: string;
  question: string;
  options: string[];
}

export function useStepper(quizData: SafeQuiz) {
  const questions: StepperQuestion[] = quizData.questions.map((q, index) => ({
    id: `question-${index}`,
    title: q.title,
    question: q.question,
    options: q.options,
  }));

  const { useStepper } = defineStepper(...questions);
  const stepper = useStepper();

  return {
    stepper,
    currentStepIndex: stepper.all.indexOf(stepper.current),
    stepperControls: {
      isFirst: stepper.isFirst,
      isLast: stepper.isLast,
      prev: stepper.prev,
      next: stepper.next,
    },
    switchQuestion: (
      render: (question: StepperQuestion, index: number) => ReactElement
    ) =>
      stepper.switch({
        ...Object.fromEntries(
          questions.map((question, index) => [
            question.id,
            () => render(question, index),
          ])
        ),
      }),
  };
}
