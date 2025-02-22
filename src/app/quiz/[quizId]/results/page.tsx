"use client";

import { useQuiz } from "@/hooks/useQuiz";
import { useQuizResults } from "@/hooks/useQuizResults";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";

export default function ResultsPage() {
  const params = useParams();
  const quizId = params.quizId as Id<"quiz">;

  const { quizData } = useQuiz(quizId);
  const results = useQuizResults(quizId);

  if (!quizData || !results) return <div>Loading results...</div>;

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quizData.title} - Results</CardTitle>
          <p className="text-muted-foreground">
            Score: {results.score}% ({results.correctCount} of{" "}
            {results.totalQuestions} correct)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {quizData.questions.map((question, index) => (
            <div
              key={question._id}
              className={`p-4 rounded-lg border ${
                results.answers[index] ===
                results.questions[index].correctAnswerIndex
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-medium">Question {index + 1}</p>
                <div className="text-sm">
                  Selected: {results.answers[index] + 1} / Correct:{" "}
                  {results.questions[index].correctAnswerIndex + 1}
                </div>
              </div>
              <p className="mt-2 text-sm">{question.question}</p>
              {results.questions[index].explanation && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {results.questions[index].explanation}
                </p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/quiz">Back to Quizzes</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
