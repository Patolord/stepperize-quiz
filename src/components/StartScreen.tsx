import { SafeQuiz } from "@/hooks/useQuiz";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface StartScreenProps {
  quiz: SafeQuiz;
  onStart: () => void;
}

export function StartScreen({ quiz, onStart }: StartScreenProps) {
  return (
    <Card className="w-[400px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Total questions: {quiz.questions.length}
        </p>
        <p className="mt-4">{quiz.description}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onStart} className="w-full">
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
