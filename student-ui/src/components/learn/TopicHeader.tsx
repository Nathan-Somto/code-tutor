import { cn } from "@/utils";
import { Lock } from "lucide-react";
export type TopicHeaderProps = {
  name: string;
  description: string;
  isUnlocked: boolean;
  totalXp?: number;
  index: number;
};
export default function TopicHeader({
  name,
  description,
  isUnlocked,
  totalXp,
  index,
}: TopicHeaderProps) {
  const backgrounds = [
    "dark:bg-green-600 bg-green-500",
    "dark:bg-violet-600 bg-green-500",
    "dark:bg-sky-600 bg-sky-500",
    "dark:bg-emerald-600 bg-emerald-500",
    "dark:bg-indigo-600 bg-indigo-500",
  ];
  return (
    <header
      className={cn(
        "sticky w-full flex  z-[51] gap-2 mb-4 top-0 items-center h-28 py-2 px-5 lg:rounded-md",
        isUnlocked && backgrounds[index % backgrounds.length],
        !isUnlocked && "dark:bg-neutral-600 bg-neutral-500 text-neutral-300"
      )}
    >
      {!isUnlocked && (
        <div className="mr-4">
          <Lock size={28} />
          <p className="sr-only">locked</p>
        </div>
      )}
      <div className="w-full">
        <h1 className="text-slate-200 text-2xl  font-semibold tracking-tight leading-normal">
          {name}
        </h1>
        <div className="flex items-center justify-between w-full">
          <p className="opacity-80 text-white">{description}</p>
          {totalXp && !isUnlocked && (
            <p className="font-semibold  text-xs bg-emerald-500/80 dark:bg-emerald-500/50 p-2 rounded-tl-lg rounded-br-lg">
              {totalXp}xp
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
