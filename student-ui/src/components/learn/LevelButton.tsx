import {
  BookOpenTextIcon,
  BoxIcon,
  CheckIcon,
  Code2Icon,
  CrownIcon,
  StarIcon,
} from "lucide-react";
import StartPopup from "./StartPopup";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type LevelType = "lesson" | "quiz" | "code";
export type LevelButtonProps = {
  isCurrent: boolean;
  levelType: LevelType;
  index: number;
  link: string; // link is basically /learn/:courseName/level/:levelId (shows a loading page then redirects to the appropriate challenge page)
  isUnlocked: boolean;
  progress?: number;
  mysteryLevel: boolean;
  isLast: boolean;
  isCompleted: boolean;
};

function LevelButton({
  isCurrent,
  levelType,
  mysteryLevel,
  isLast,
  isCompleted,
  isUnlocked,
  link,
  index,
  progress,
}: LevelButtonProps) {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;

  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;
  const size = 30;
  // use the index to determine how the button will be arranged.
  // use progress to show a circular progress bar
  const navigate = useNavigate();
  const Icon = () => {
    if (isCompleted) return <CheckIcon size={size} />;
    if (isLast) return <CrownIcon size={size} />;
    if (mysteryLevel) return <StarIcon size={size} />;
    if (levelType === "code") return <Code2Icon size={size} />;
    if (levelType === "lesson") return <BookOpenTextIcon size={size} />;
    if (levelType === "quiz") return <BoxIcon size={size} />;
    return <StarIcon size={size} />;
  };
  return (
    <div
      className="relative h-[103px] w-[103px]"
      style={{
        right: `${rightPosition}px`,
        marginTop: `${isCurrent ? 40 : isLast ? 65 : 25}px`,
      }}
      data-margin={`${indentationLevel * 20}`}
    >
      <>
        {isCurrent && <StartPopup />}
        {isUnlocked ? (
        <CircularProgressbarWithChildren
          value={progress ?? 0}
          styles={{
            path: {
              stroke: "#4ade80",
            },
            trail: {
              stroke: "#e5e7eb",
            },
          }}
        >
          <Button
            variant={"primary"}
            size="rounded"
            aria-disabled={!isUnlocked}
            disabled={!isUnlocked}
            className={cn(
              "mx-auto text-slate-200 flex-shrink-0  relative h-[70px]  w-[70px] border-b-8 bg-primary/90",
            )}
            onClick={() => navigate(link)}
          >
            <Icon />
          </Button>
        </CircularProgressbarWithChildren>
        ) : (
          <Button
          variant={"primary"}
          size="rounded"
          disabled
          aria-disabled
          className="bg-neutral-600 mx-auto h-[80px] border-b-8 w-[80px] pointer-events-none text-neutral-300  ring-neutral-500 border-neutral-400 ring-offset-neutral-300"
          >
            <Icon/>
          </Button>
        )}
      </>
    </div>
  );
}

export default LevelButton;
