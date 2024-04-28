import { useKeyboardShortCut } from "@/hooks/useKeyboardShortCut";
import { cn } from "@/utils";
import { Button } from "../ui/button";

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
      status: "correct" | "failed" | "none";
      onSubmit: () => void;
      isCompleted: boolean;
      disabled: boolean;
    };
export default function Footer(props: Props) {
  const isQuizType = props.type === "quiz";
  let buttonText = "";
  if (isQuizType) {
    if (props.status === "correct") {
      buttonText = props.isCompleted ? "Next Level" : "Next";
    } else if (props.status === "failed") {
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
    ? props.onCheck
    : () =>  props.changePage('left')
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
        "border-t h-20 bottom-0 bg-background fixed max-w-5xl inset-x-0 w-full mx-auto flex items-center justify-end px-4 ",
        isQuizType &&
          props.status === "correct" &&
          "bg-green-100 dark:bg-green-300",
        isQuizType &&
          props.status === "failed" &&
          "bg-rose-100 dark:bg-rose-300",
          !isQuizType && !props.isFirstPage  && 
          "justify-between"
      )}
    >
      {!isQuizType && !props.isFirstPage  && (
        <Button
        onClick={() => props.changePage('right')}
        size="sm"
        className="lg:h-11 lg:px-8"
        >
          Previous
        </Button>
      )}
      <Button
        variant={
          isQuizType
            ? props.status === "correct"
              ? "primary"
              : props.status === "failed"
              ? "danger"
              : "default"
            : "primary"
        }
        onClick={handler}
        size="sm"
        className="text-slate-700 lg:h-11 lg:px-8 "
        disabled={props.disabled}
      >
        {buttonText}
      </Button>
    </footer>
  );
}
