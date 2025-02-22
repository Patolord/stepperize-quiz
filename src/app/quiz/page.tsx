"use client";

import { useQuizzes } from "@/hooks/useQuiz";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function QuizListPage() {
  const quizzes = useQuizzes();
  const router = useRouter();
  const startQuiz = useMutation(api.questions.startQuiz);

  const handleStartQuiz = async (quizId: Id<"quiz">) => {
    await startQuiz({ quizId });
    router.push(`/quiz/${quizId}`);
  };

  if (!quizzes) return <div>Loading quizzes...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz._id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => handleStartQuiz(quiz._id)}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
