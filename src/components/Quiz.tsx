"use client";

import { Id } from "../../convex/_generated/dataModel";
import { useQuiz } from "@/hooks/useQuiz";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { defineStepper } from "@stepperize/react";
import { useState, useEffect } from "react";

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

function QuizStepper({
  quizData,
  progress,
  onSubmitAnswer,
}: {
  quizData: NonNullable<ReturnType<typeof useQuiz>["quizData"]>;
  progress: NonNullable<ReturnType<typeof useQuiz>["progress"]>;
  onSubmitAnswer: ReturnType<typeof useQuiz>["submitAnswer"];
}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
    explanation?: string;
    answered: boolean;
  } | null>(null);

  const previousAnswers = progress.answers;
  const answerFeedback = progress.answerFeedback;

  const { useStepper } = defineStepper(
    ...quizData.questions.map((q, index) => ({
      id: `question-${index}`,
      title: q.title,
      question: q.question,
      options: q.options,
    }))
  );

  const stepper = useStepper();
  const currentStepIndex = stepper.all.indexOf(stepper.current);

  useEffect(() => {
    const historicalAnswer = previousAnswers[currentStepIndex];
    const historicalFeedback = answerFeedback?.[currentStepIndex];

    if (historicalAnswer !== undefined && historicalFeedback) {
      setSelectedOption(historicalAnswer);
      setFeedback({
        isCorrect: historicalFeedback.isCorrect,
        message: historicalFeedback.isCorrect
          ? "Correct! Well done!"
          : "Incorrect. Try again!",
        explanation: historicalFeedback.explanation,
        answered: true,
      });
    } else {
      setSelectedOption(null);
      setFeedback(null);
    }
  }, [currentStepIndex, previousAnswers, answerFeedback]);

  const handleAnswerSubmit = async () => {
    if (selectedOption === null) return false;

    try {
      const result = await onSubmitAnswer(selectedOption as 0 | 1 | 2 | 3);

      setFeedback({
        isCorrect: result.isAnswerCorrect,
        message: result.feedback,
        explanation: result.explanation,
        answered: true,
      });

      return result.isAnswerCorrect;
    } catch (error) {
      console.error("Failed to submit answer:", error);
      return false;
    }
  };

  const handleNext = () => {
    if (currentStepIndex >= previousAnswers.length) {
      setSelectedOption(null);
      setFeedback(null);
    }
    stepper.next();
  };

  return (
    <div className="p-10">
      <Card className="w-[400px] mx-auto">
        {stepper.switch({
          ...Object.fromEntries(
            quizData.questions.map((_, index) => [
              `question-${index}`,
              (step) => (
                <>
                  <CardHeader>
                    <CardTitle>
                      Question {index + 1} of {quizData.questions.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{step.question}</p>
                    <div className="flex flex-col gap-2 mt-4">
                      {step.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          variant={
                            selectedOption === optionIndex
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedOption(optionIndex)}
                          className="w-full justify-start"
                          disabled={
                            feedback?.answered ||
                            index < progress?.currentQuestionIndex
                          }
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                    {feedback && (
                      <div
                        className={`mt-4 p-4 rounded-md ${
                          feedback.isCorrect ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <p className="font-medium">{feedback.message}</p>
                        {feedback.explanation && (
                          <p className="mt-2 text-sm">{feedback.explanation}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => stepper.prev()}
                      disabled={stepper.isFirst}
                    >
                      Previous
                    </Button>
                    {feedback?.answered ? (
                      <Button onClick={handleNext} disabled={stepper.isLast}>
                        {stepper.isLast ? "Finish" : "Next Question"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAnswerSubmit}
                        disabled={selectedOption === null}
                      >
                        Submit Answer
                      </Button>
                    )}
                  </CardFooter>
                </>
              ),
            ])
          ),
        })}
      </Card>
    </div>
  );
}
