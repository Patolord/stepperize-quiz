import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface QuizQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: string[];
  stepper: {
    isFirst: boolean;
    isLast: boolean;
    prev: () => void;
    next: () => void;
  };
  state: {
    selectedOption: number | null;
    feedback: {
      isCorrect: boolean;
      message: string;
      explanation?: string;
      answered: boolean;
    } | null;
  };
  handlers: {
    onOptionSelect: (optionIndex: number) => void;
    onSubmit: () => void;
    onFinish: () => void;
  };
  disabled?: boolean;
}

export function QuizQuestion({
  questionNumber,
  totalQuestions,
  question,
  options,
  stepper,
  state,
  handlers,
  disabled = false,
}: QuizQuestionProps) {
  const isAnswered = Boolean(state.feedback?.answered);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {questionNumber} of {totalQuestions}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{question}</p>
        <div className="flex flex-col gap-2 mt-4">
          {options.map((option, optionIndex) => (
            <Button
              key={optionIndex}
              variant={
                state.selectedOption === optionIndex ? "default" : "outline"
              }
              onClick={() => handlers.onOptionSelect(optionIndex)}
              className="w-full justify-start"
              disabled={disabled || state.feedback?.answered}
            >
              {option}
            </Button>
          ))}
        </div>
        {state.feedback && (
          <div
            className={`mt-4 p-4 rounded-md ${
              state.feedback.isCorrect ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p className="font-medium">{state.feedback.message}</p>
            {state.feedback.explanation && (
              <p className="mt-2 text-sm">{state.feedback.explanation}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={stepper.prev}
          disabled={stepper.isFirst}
        >
          Previous
        </Button>
        {isAnswered ? (
          <Button
            onClick={stepper.isLast ? handlers.onFinish : stepper.next}
            disabled={disabled}
          >
            {stepper.isLast ? "Finish Quiz" : "Next Question"}
          </Button>
        ) : (
          <Button
            onClick={handlers.onSubmit}
            disabled={disabled || state.selectedOption === null}
          >
            Submit Answer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
