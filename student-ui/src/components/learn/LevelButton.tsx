import {
  BookOpenTextIcon,
  BoxIcon,
  CheckIcon,
  Code2Icon,
  CrownIcon,
  StarIcon,
} from "lucide-react";
import StartPopup from "./StartPopup";
import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { LevelType, Rank } from "@/types";


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
  xp: number;
  rank?: keyof typeof Rank;
  name: string;
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
  xp,
  rank,
  name
}: LevelButtonProps) {
  const [menu, setMenu] = React.useState(false);
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;
  const rankStyles = {
    "Easy": 'text-green-500 ', // gold color for expert
    "Medium": 'text-blue-500 ',
    "Hard": 'text-orange-500 ',
    "Advanced": 'text-slate-500 ',
    "Expert": 'text-[gold] ',
  };
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
    if (levelType.toLowerCase() === "code") return <Code2Icon size={size} />;
    if (levelType.toLowerCase() === "lesson") return <BookOpenTextIcon size={size} />;
    if (levelType.toLowerCase() === "quiz") return <BoxIcon size={size} />;
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
        <DropdownMenu open={menu} onOpenChange={(prev) => setMenu(prev)} >     
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
          <DropdownMenuTrigger asChild>
          <Button
            variant={"primary"}
            size="rounded"
            aria-disabled={!isUnlocked}
            disabled={!isUnlocked}
            className={cn(
              "mx-auto text-slate-200 flex-shrink-0 outline-none relative h-[70px]  w-[70px] border-b-8 bg-primary/90",
            )}
          >
            <Icon />
          </Button>
          </DropdownMenuTrigger>
        </CircularProgressbarWithChildren>
        ) : (
          <DropdownMenuTrigger asChild>
          <Button
          variant={"primary"}
          size="rounded"
          disabled
          aria-disabled
          className="bg-neutral-600 mx-auto h-[80px] border-b-8 w-[80px] pointer-events-none text-neutral-300  ring-neutral-500 border-neutral-400 ring-offset-neutral-300"
          >
            <Icon/>
          </Button>
        </DropdownMenuTrigger>
        )}
        <DropdownMenuContent className=" min-h-28 py-3 px-2 min-w-44 z-[9999999999999999]">
          <div className="flex items-center gap-x-2 flex-wrap">
          <h3 className="text-lg mb-1.5 font-semibold capitalize ">{name}</h3>
          <p className="rounded-md border-2 px-2 bg-primary text-white border-slate-400 dark:border-slate-800">{levelType}</p>
          </div>
         {rank && ( 
          <div className="flex items-center gap-x-1">
            <p>Difficulty: </p>
            <p className={`${rankStyles[rank]}  font-medium`}>{rank}</p>
          </div>
         )
         }
          <Button variant="primary" onClick={() => {navigate(link); setMenu(false);}} className="w-full mt-3">
          <span>Start</span>
          <span className="dark:text-slate-950 text-slate-700 ml-1">(+{xp}XP)</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      </>
    </div>
  );
}

export default LevelButton;
