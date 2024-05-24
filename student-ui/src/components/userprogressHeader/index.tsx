import Thunder from "@/assets/thunder.svg";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useRoot } from "@/providers/RootProvider";
import { Link } from "react-router-dom";
import { sampleData } from "../course/sampleData";
import Streaks from "@/components/streaks";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import Fire from "@/assets/fire.svg";
import HintsButton from "../hintsButton";
import { ShieldCheckIcon } from "lucide-react"
export default function UserProgressHeader() {
    const {
        data: { currentCourse: id, totalXp, streakData, hints },
      } = useRoot() as NonNullable<ReturnType<typeof useRoot>>;
      const currentCourse = sampleData.find((item) => item.id === +id);
      async function handleStreakFreeze() {
        // send a request to the server to freeze the streak.
        // reduce the user's xp points by -20
        // change the streakData state to reflect the new streak to a 2 for yesterday and today.
      }
    return (
        <header className="flex items-center gap-x-3">
        {/* Course Link */}
        <Link to={`/learn/${currentCourse?.id}`}>
          <img
            src={currentCourse?.imgSrc}
            alt={`${currentCourse?.title}`}
            className="object-contain flex-shrink-0 rounded-md h-10 w-10"
          />
        </Link>
        {/* Streak Number with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="transparent" className="px-2 gap-x-1 font-medium">
              <img
                src={Fire}
                alt="streaks icon"
                className="h-6 w-6 object-contain"
              />
              <span className="from-orange-600 to-yellow-600 text-base bg-clip-text text-transparent bg-gradient-to-r">
                {streakData.currentCount}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[10000] px-8 !min-h-fit py-4">
            <>
              {/* Streaks Info */}
              <div>
                <h3 className="text-2xl font-medium text-slate-300 mb-4 text-center">Your Streak</h3>
                <Streaks
                  playAnimation={false}
                  currentCount={streakData.currentCount}
                  streakDays={streakData.days}
                  currentDay={streakData.currentDay}
                />
              </div>
              {/* Buttons Container */}
              <div className="gap-y-4 mt-4 flex flex-col">
                <Button disabled={totalXp === 0} variant='secondary' className="justify-start gap-x-2 bg-blue-700" onClick={handleStreakFreeze}>
                  <div className="size-7 rounded-full flex items-center text-white/80 justify-center bg-blue-400">
                  <ShieldCheckIcon className="size-5 text-white/80"/>
                  </div>
                  <span>Use Freeze Streak <span className="font-bold">(-20xp)</span></span>
                </Button>
                <Button variant="primary" onClick={() => console.log('sends user to their current level.')}>
                  Learn to Save Streaks
                </Button>
              </div>
            </>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Xp Number with tool tip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="transparent"
                className="px-2 text-[gold] gap-x-1"
              >
                <img
                  src={Thunder}
                  alt="xp icon"
                  className="h-6 w-6 object-contain"
                />
                <span className="">{totalXp}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> Experience Points </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* Hints Number */}
        <HintsButton
          hintsLeft={hints.totalHints}
          hintsRefreshDate={hints.refreshDate}
          className="flex-row-reverse text-base"
        />
      </header>
    )
}