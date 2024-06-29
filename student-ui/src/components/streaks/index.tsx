import { cn } from "@/utils";
import { CheckIcon, ShieldCheckIcon } from "lucide-react";
import StreaksAnimation from "@/data/lottieFiles/streaks-animation.json";
import Lottie from "react-lottie";
import { type StreakNumber } from "@/providers/RootProvider";

type Props = {
  currentCount: number;
  streakDays: StreakNumber[];
  currentDay: number;
  currentStatus: StreakNumber;
  playAnimation?: boolean;
};

export default function Streaks({
  playAnimation = true,
  currentCount,
  streakDays,
  currentDay,
  currentStatus,
}: Props) {
  // Validate inputs to avoid potential bugs
  if (currentCount < 0) {
    console.error("Invalid currentCount: must be a non-negative number.");
    return null;
  }

  if (!Array.isArray(streakDays) || streakDays.length > 7) {
    console.error("Invalid streakDays: must be an array with length up to 7.");
    return null;
  }

  if (currentDay < 0 || currentDay > 6) {
    console.error("Invalid currentDay: must be a number between 0 and 6.");
    return null;
  }

  // Pad the streakDays array with zeros at the front if its length is less than 7
  const paddedStreakDays = [...Array(7 - streakDays.length).fill(0), ...streakDays];

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  // Combine the past days, current day and future days to display
  const pastDays = paddedStreakDays.slice(0, currentDay);
  const futureDays = new Array(6 - currentDay).fill(0);
  const daysToDisplay = [...pastDays, currentStatus, ...futureDays];

  return (
    <div className="flex items-center flex-col justify-center gap-3">
      {/* Current Streak Count with a lottie animation. */}
      {/* Calendar showing days missed and days you learned */}
      {playAnimation && (
        <>
          <div className="relative">
            {/* The Current Streak number with a black box shadow, positioned to the top of the lottie animation. */}
            <p
              style={{ textShadow: "3px 3px black" }}
              className="absolute top-[40%] left-2/4 -translate-x-2/4 text-white  -translate-y-2/4 w-fit z-[8] text-3xl font-bold text-center"
            >
              {currentCount}
            </p>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: StreaksAnimation,
              }}
              height={150}
              width={150}
            />
          </div>
          <p className="bg-clip-text my-2 text-transparent font-medium text-xl bg-gradient-to-r from-orange-500 to-yellow-600">
            day streak
          </p>
        </>
      )}
      <div className="flex items-center space-x-2">
        {daysToDisplay.map((streakValue, index) => (
          <div
            key={index}
            className="flex flex-col justify-center items-center gap-y-1"
          >
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 text-white rounded-full bg-transparent border",
                currentDay === index && "border-[4px] border-orange-500",
                streakValue === 1 && "bg-green-500",
                streakValue === 2 && "bg-blue-500"
              )}
            >
              {index < currentDay &&
                (streakValue === 1 ? (
                  <CheckIcon className="w-5 h-5 text-white flex-shrink-0" />
                ) : streakValue === 2 ? (
                  <ShieldCheckIcon className="w-5 h-5" />
                ) : null)}
            </div>
            <p
              className={cn(
                currentDay === index &&
                  "bg-clip-text text-transparent text-center bg-gradient-to-r from-orange-600 to-yellow-400"
              )}
            >
              {days[index]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
