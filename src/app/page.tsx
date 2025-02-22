import Quiz from "@/components/Quiz";
import { Id } from "../../convex/_generated/dataModel";
export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
      <Quiz quizId={"j97bgzdbj9ap6rk1jns6q3bypd7avy76" as Id<"quiz">} />
    </div>
  );
}
