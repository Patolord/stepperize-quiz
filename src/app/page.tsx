import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1>Hello World</h1>
        <Button asChild>
          <Link href="/quiz">Go to quizzes</Link>
        </Button>
      </div>
    </>
  );
}
