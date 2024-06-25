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
// import { sampleData } from "../course/sampleData";
import Streaks from "@/components/streaks";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import Fire from "@/assets/fire.svg";
import Diamond from "@/assets/diamond.svg";
import { ShieldCheckIcon } from "lucide-react"
export default function UserProgressHeader() {
    const {
        data: { currentCourse, streaksData, xpPoints, gems},
        isFetching
      } = useRoot() as NonNullable<ReturnType<typeof useRoot>>;
      async function handleStreakFreeze() {
        // send a request to the server to freeze the streak.
        // reduce the user's xp points by -20
        // change the streakData state to reflect the new streak to a 2 for yesterday and today.
      }
    return (
        <header className="flex items-center gap-x-3">
        {/* Course Link */}
        {
          currentCourse &&(
            <Link to={`/learn/${currentCourse?.id}`}>
            <img
              src={currentCourse?.imageSrc}
              alt={`${currentCourse?.title}`}
              className="object-cover flex-shrink-0 rounded-md h-10 w-10 border"
            />
          </Link>
          )
        }
        {isFetching ? (
          <>    
          <div className="px-2 gap-x-1 font-medium flex items-center animate-pulse">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <span className="h-6 w-10 bg-gray-300 rounded-md"></span>
        </div>
        {/* Xp Number Skeleton */}
        <div className="px-2 text-[gold] gap-x-1 flex items-center animate-pulse">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <span className="h-6 w-10 bg-gray-300 rounded-md"></span>
        </div>
        {/* Gems Number Skeleton */}
        <div className="px-2 text-sky-300 gap-x-1.5 flex items-center animate-pulse">
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          <span className="h-5 w-10 bg-gray-300 rounded-md"></span>
        </div>
          </>
        ) : (
          <>
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
                {streaksData.currentCount}
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
                  currentCount={streaksData.currentCount}
                  streakDays={streaksData.history}
                  currentDay={streaksData.currentDate.getDay() - 1}
                  currentStatus={streaksData.currentStatus}
                />
              </div>
              {/* Buttons Container */}
              <div className="gap-y-4 mt-4 flex flex-col">
                <Button disabled={gems === 0} variant='secondary' className="justify-start gap-x-2 bg-blue-600 dark:bg-blue-700" onClick={handleStreakFreeze}>
                  <div className="size-7 rounded-full flex items-center text-white/80 justify-center bg-blue-400">
                  <ShieldCheckIcon className="size-5 text-white/80"/>
                  </div>
                  <span>Use Freeze Streak <span className="font-bold">(-0 gems)</span></span>
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
                <span className="">{xpPoints}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> Experience Points </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="transparent"
                className="px-2 text-sky-300 gap-x-1.5"
              >
                <img
                  src={Diamond}
                  alt="xp icon"
                  className="h-5 w-5 object-contain"
                />
                <span className="">{gems}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> Gems </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
          </>
        )}   
      </header>
    )
}