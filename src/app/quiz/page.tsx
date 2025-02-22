"use client";

import { useQuizzes } from "@/hooks/useQuiz";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useAllProgress } from "@/hooks/useProgress";

export default function QuizListPage() {
  const quizzes = useQuizzes();
  const router = useRouter();
  const startQuiz = useMutation(api.questions.startQuiz);
  const progress = useAllProgress();

  const handleStartQuiz = async (quizId: Id<"quiz">) => {
    await startQuiz({ quizId });
    router.push(`/quiz/${quizId}`);
  };

  const handleResumeQuiz = (quizId: Id<"quiz">) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleViewResults = (quizId: Id<"quiz">) => {
    router.push(`/quiz/${quizId}/results`);
  };

  if (!quizzes) return <div>Loading quizzes...</div>;

  return (
    <div className="container mx-auto py-10 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => {
          const quizProgress =
            progress?.filter((p) => p.quizId === quiz._id) || [];
          const latestProgress = quizProgress[0];
          const hasInProgress = latestProgress && !latestProgress.isComplete;

          return (
            <Card key={quiz._id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  {quizProgress.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Previous Attempts:</p>
                      {quizProgress.map((p, index) => (
                        <div
                          key={p._id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>
                            Attempt {quizProgress.length - index}
                            {p.isComplete ? (
                              <span className="text-green-600 ml-2">✓</span>
                            ) : (
                              <span className="text-blue-600 ml-2">⟳</span>
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              p.isComplete
                                ? handleViewResults(quiz._id)
                                : handleResumeQuiz(quiz._id)
                            }
                          >
                            {p.isComplete ? "View Results" : "Resume"}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                {!hasInProgress && (
                  <Button
                    className="w-full"
                    onClick={() => handleStartQuiz(quiz._id)}
                  >
                    Start New Attempt
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
