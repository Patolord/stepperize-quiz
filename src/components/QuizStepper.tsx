import { Card } from "./ui/card";
import { QuizQuestion } from "./QuizQuestion";
import { useQuizStepperState } from "@/hooks/useQuizStepperState";
import { SafeQuiz } from "@/hooks/useQuiz";

interface QuizStepperProps {
  quizData: SafeQuiz;
  progress: {
    currentQuestionIndex: number;
    answers: number[];
    answerFeedback?: {
      isCorrect: boolean;
      explanation?: string;
    }[];
  };
  onSubmitAnswer: (selectedOptionIndex: 0 | 1 | 2 | 3) => Promise<{
    isAnswerCorrect: boolean;
    feedback: string;
    explanation?: string;
  }>;
}

export function QuizStepper({
  quizData,
  progress,
  onSubmitAnswer,
}: QuizStepperProps) {
  const {
    state,
    stepperControls,
    switchQuestion,
    handleOptionSelect,
    handleAnswerSubmit,
    handleNext,
    handleFinish,
  } = useQuizStepperState({
    quizData,
    previousAnswers: progress.answers,
    answerFeedback: progress.answerFeedback,
    onSubmitAnswer,
  });

  return (
    <div className="p-10">
      <Card className="w-[400px] mx-auto">
        {switchQuestion((question, index) => (
          <QuizQuestion
            questionNumber={index + 1}
            totalQuestions={quizData.questions.length}
            question={question.question}
            options={question.options}
            stepper={{
              ...stepperControls,
              next: handleNext,
            }}
            state={state}
            handlers={{
              onOptionSelect: handleOptionSelect,
              onSubmit: handleAnswerSubmit,
              onFinish: handleFinish,
            }}
            disabled={index > progress.currentQuestionIndex}
          />
        ))}
      </Card>
    </div>
  );
}
