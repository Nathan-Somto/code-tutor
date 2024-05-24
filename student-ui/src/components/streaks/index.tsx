import { cn } from "@/utils";
import { CheckIcon, ShieldCheckIcon } from "lucide-react";
import StreaksAnimation from "@/data/lottieFiles/streaks-animation.json";
import Lottie from "react-lottie";
import {type StreakNumber} from "@/providers/RootProvider";

type Props = {
  currentCount: number;
  streakDays: StreakNumber[];
  currentDay: number;
  playAnimation?: boolean;
};
export default function Streaks({
  playAnimation = true,
  currentCount,
  streakDays,
  currentDay,
}: Props) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div className="flex items-center space-x-2">
      {/* Current Streak Count with a lottie animation.*/}
      {/* Calendar showing days missed and days you learned */}
      {playAnimation && (
        <div className="relative">
            {/* The text should have a black box shadow */}
          {/* The Current Streak number with a black box box shadow. absolutely positioned to the top of the lottie animation. */}
          <p className="absolute top-0  left-0 right-0 text-2xl font-bold text-center text-white ">
            {currentCount}
          </p>
          <Lottie
            style={{ width: "90px", height: "90px" }}
            options={{
              loop: false,
              autoplay: true,
              animationData: StreaksAnimation,
            }}
          />
        </div>
      )}
      <div className="flex items-center space-x-2">
        {streakDays.map((streakValue, index) => (
          <div className="flex flex-col justify-center items-center gap-y-1">
            <div
              key={index}
              className={cn(
                "flex items-center justify-center w-8 h-8 text-white rounded-full bg-transparent border",
                currentDay === index && "border-[3px]",
                streakValue === 1 && "bg-green-500",
                streakValue === 2 && "bg-blue-500"
              )}
            >
              {streakValue === 1 ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : streakValue === 2 ? (
                <ShieldCheckIcon className="w-5 h-5" />
              ) : null}
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
