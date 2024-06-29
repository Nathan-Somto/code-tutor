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
      sequenceOptions?: string[];
      handleSequenceClick?: (item: string) => void;
      outOfHearts: boolean;
      openHeartsModal: () => void;
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
  let handler = props.isCompleted
    ? props.onSubmit
    : props.type === "quiz"
    ? props.status === "correct"
      ? props.changePage
      : props.onCheck
    : () => props.changePage("left");
  handler = props.type === 'quiz' && props.outOfHearts ? props.openHeartsModal : handler;
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
        !isQuizType && !props.isFirstPage && "justify-between",
        isQuizType && props.sequenceOptions && "items-center justify-center"
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
      {isQuizType && (
        <div
          className={cn(
            "flex items-center gap-2",
            props.status === "correct" && "text-green-600",
            props.status === "wrong" && "text-rose-600",
            props.sequenceOptions && "absolute left-2 top-0 bottom-0 my-auto z-[4]"
          )}
        >
          {props.status === "wrong" ? (
            <>
              <XCircle className="lg:size-[28px]" />
              <p className="text-rose-600 font-semibold leading-normal lg:text-lg">
                Try Again
              </p>
            </>
          ) : props.status === "correct" ? (
            <>
              <CheckCircle className="lg:size-[28px]" />
              <p className="text-green-600 font-semibold leading-normal lg:text-lg">
                Nicely done!
              </p>
            </>
          ) : null}
        </div>
      )}
      {isQuizType && props.sequenceOptions && (
        <div className="flex  gap-4 items-center flex-wrap w-[80%] mx-auto justify-center">
          {props.sequenceOptions.map((item, index) => (
            <Button
              key={item + index}
              onClick={() =>
                props.handleSequenceClick && props.handleSequenceClick(item)
              }
            >
              {item}
            </Button>
          ))}
        </div>
      )}
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
        className={cn(
          "lg:h-11 lg:px-8",
          isQuizType &&
            props.sequenceOptions &&
            "absolute bottom-2 right-3 z-[4]"
        )}
        disabled={props.disabled}
      >
        {buttonText}
      </Button>
    </footer>
  );
}
