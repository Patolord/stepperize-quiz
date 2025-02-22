"use client";

import { defineStepper } from "@stepperize/react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BookmarkIcon, BookmarkCheckIcon } from "lucide-react";
const { useStepper, steps, utils } = defineStepper(
  {
    id: "step-1",
    title: "Step 1",
    question: "What is the capital of France?",
    answers: ["Paris", "Berlin", "Rome", "Madrid"],
  },
  {
    id: "step-2",
    title: "Step 2",
    question: "What is the shortest country in the world?",
    answers: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"],
  },
  {
    id: "step-3",
    title: "Step 3",
    question: "When is the next election?",
    answers: ["2025", "2026", "2027", "2028"],
  },
  {
    id: "step-4",
    title: "Finished!",
    question: "Finished!",
    answers: [],
  }
);

type Step = {
  id: (typeof steps)[number]["id"];
  title: (typeof steps)[number]["title"];
  question: (typeof steps)[number]["question"];
  answers: (typeof steps)[number]["answers"];
};

type StepperType = {
  current: (typeof steps)[number];
  all: (typeof steps)[number][];
  next: () => void;
  prev: () => void;
  reset: () => void;
  goTo: (id: Step["id"]) => void;
  isFirst: boolean;
  isLast: boolean;
};

type BookmarkState = Record<Step["id"], boolean>;

export default function Quiz() {
  const stepper = useStepper() as StepperType;

  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <div className="p-10">
      <nav className="mb-4">
        <div className="flex gap-2">
          {stepper.all.map((step, index) => (
            <button
              onClick={() => stepper.goTo(step.id)}
              key={step.id}
              className={` rounded-full w-10 h-10 flex items-center justify-center ${
                index === currentIndex
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </nav>
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 ">
            Step {currentIndex + 1} <Bookmark stepper={stepper} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{steps[currentIndex].question}</p>
          <div className="flex items-center gap-2">
            {steps[currentIndex].answers?.map((answer) => (
              <Button variant="outline" key={answer}>
                {answer}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => stepper.prev()}
            disabled={stepper.isFirst}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            onClick={() => stepper.next()}
            disabled={stepper.isLast}
          >
            Next
          </Button>
          {stepper.isLast && (
            <Button variant="outline" onClick={() => stepper.reset()}>
              Reset
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

const Bookmark = ({ stepper }: { stepper: StepperType }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkState>({
    "step-1": false,
    "step-2": false,
    "step-3": false,
    "step-4": false,
  });

  const toggleBookmark = () => {
    setBookmarks((prev) => ({
      ...prev,
      [stepper.current.id]: !prev[stepper.current.id],
    }));
  };

  return (
    <Button variant="link" onClick={toggleBookmark}>
      {bookmarks[stepper.current.id] ? (
        <BookmarkCheckIcon size="icon" className="text-green-500" />
      ) : (
        <BookmarkIcon size="icon" />
      )}
    </Button>
  );
};
