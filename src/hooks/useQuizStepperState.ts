import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SafeQuiz } from "./useQuiz";
import { useStepper } from "./useStepper";

interface QuizStepperState {
  selectedOption: number | null;
  feedback: {
    isCorrect: boolean;
    message: string;
    explanation?: string;
    answered: boolean;
  } | null;
}

interface UseQuizStepperStateProps {
  quizData: SafeQuiz;
  previousAnswers: number[];
  answerFeedback: { isCorrect: boolean; explanation?: string }[] | undefined;
  onSubmitAnswer: (selectedOptionIndex: 0 | 1 | 2 | 3) => Promise<{
    isAnswerCorrect: boolean;
    feedback: string;
    explanation?: string;
  }>;
}

export function useQuizStepperState({
  quizData,
  previousAnswers,
  answerFeedback,
  onSubmitAnswer,
}: UseQuizStepperStateProps) {
  const router = useRouter();
  const [state, setState] = useState<QuizStepperState>({
    selectedOption: null,
    feedback: null,
  });

  const { currentStepIndex, stepperControls, switchQuestion } =
    useStepper(quizData);

  useEffect(() => {
    const historicalAnswer = previousAnswers[currentStepIndex];
    const historicalFeedback = answerFeedback?.[currentStepIndex];

    if (historicalAnswer !== undefined && historicalFeedback) {
      setState({
        selectedOption: historicalAnswer,
        feedback: {
          isCorrect: historicalFeedback.isCorrect,
          message: historicalFeedback.isCorrect
            ? "Correct! Well done!"
            : "Incorrect. Try again!",
          explanation: historicalFeedback.explanation,
          answered: true,
        },
      });
    } else {
      setState({
        selectedOption: null,
        feedback: null,
      });
    }
  }, [currentStepIndex, previousAnswers, answerFeedback]);

  const handleOptionSelect = (optionIndex: number) => {
    setState((prev) => ({
      ...prev,
      selectedOption: optionIndex,
      feedback: null, // Reset feedback when selecting a new option
    }));
  };

  const handleAnswerSubmit = async () => {
    if (state.selectedOption === null) return false;

    try {
      const result = await onSubmitAnswer(
        state.selectedOption as 0 | 1 | 2 | 3
      );

      setState((prev) => ({
        ...prev,
        feedback: {
          isCorrect: result.isAnswerCorrect,
          message: result.feedback,
          explanation: result.explanation,
          answered: true,
        },
      }));

      return result.isAnswerCorrect;
    } catch (error) {
      console.error("Failed to submit answer:", error);
      return false;
    }
  };

  const handleNext = () => {
    stepperControls.next();
    // Always reset state when moving to next question
    setState({
      selectedOption: null,
      feedback: null,
    });
  };

  const handleFinish = () => {
    router.push("/quiz");
  };

  return {
    state,
    stepperControls,
    switchQuestion,
    handleOptionSelect,
    handleAnswerSubmit,
    handleNext,
    handleFinish,
  };
}
