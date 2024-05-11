import { useKeyboardShortCut } from "@/hooks/useKeyboardShortCut";
import { cn } from "@/utils";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";

type Props =
  | {
      type: "lesson";
      onSubmit: () => void;
      disabled: boolean;
      changePage: (direction: "left" | "right") => void;
      isCompleted: boolean;
      isFirstPage: boolean;
    }
  | {
      type: "quiz";
      onCheck: () => void;
      status: "correct" | "wrong" | null;
      onSubmit: () => void;
      isCompleted: boolean;
      disabled: boolean;
      threeInRrow?: boolean;
      changePage: () => void;
    };
export default function Footer(props: Props) {
  const isQuizType = props.type === "quiz";
  let buttonText = "";
  if (isQuizType) {
    if (props.status === "correct") {
      buttonText = props.isCompleted ? "Next Level" : "Next";
    } else if (props.status === "wrong") {
      buttonText = "Try Again";
    } else {
      buttonText = "Check";
    }
  } else {
    buttonText = props.isCompleted ? "Next Level" : "Next";
  }
  //@Todo: use arrow key combinations for changing pages
  const handler = props.isCompleted
    ? props.onSubmit
    : props.type === "quiz"
    ? props.status === "correct"
      ? props.changePage
      : props.onCheck
    : () => props.changePage("left");
  useKeyboardShortCut({
    callback: handler,
    key: "ENTER",
    options: {
      ctrlKey: false,
    },
  });
  return (
    <footer
      className={cn(
        "border-t h-20 bottom-0 bg-background fixed  inset-x-0 w-full mx-auto flex items-center justify-end px-4 ",
        isQuizType &&
          props.status === "correct" &&
          "bg-green-100 dark:bg-green-300/90 justify-between",
        isQuizType &&
          props.status === "wrong" &&
          "bg-rose-100 dark:bg-rose-200 justify-between",
        !isQuizType && !props.isFirstPage && "justify-between"
      )}
    >
      {!isQuizType && !props.isFirstPage && (
        <Button
          onClick={() => props.changePage("right")}
          size="sm"
          className="lg:h-11 lg:px-8"
        >
          Previous
        </Button>
      )}
      {isQuizType &&
        (props.status === "wrong" ? (
          <div className="flex items-center gap-2 text-rose-600">
            <XCircle className="lg:size-[28px]" />
            <p className="text-rose-600 font-semibold leading-normal lg:text-lg">
              Try Again
            </p>
          </div>
        ) : props.status === "correct" ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="lg:size-[28px]" />
            <p className="text-green-600 font-semibold leading-normal lg:text-lg">
              Nicely done!
            </p>
          </div>
        ) : null)}
      <Button
        variant={
          isQuizType
            ? props.status === "correct"
              ? "primary"
              : props.status === "wrong"
              ? "danger"
              : "secondary"
            : "primary"
        }
        onClick={handler}
        size="sm"
        className={cn("lg:h-11 lg:px-8 ")}
        disabled={props.disabled}
      >
        {buttonText}
      </Button>
    </footer>
  );
}
