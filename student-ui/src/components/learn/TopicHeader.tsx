import { cn } from "@/utils";
import { Lock } from "lucide-react";
export type TopicHeaderProps = {
  name: string;
  description: string;
  isUnlocked: boolean;
  xpNeeded?: number;
  index: number;
};
export default function TopicHeader({
  name,
  description,
  isUnlocked,
  xpNeeded,
  index,
}: TopicHeaderProps) {
  const backgrounds = [
    "bg-green-600",
    "bg-violet-600",
    "bg-sky-600",
    "bg-emerald-600",
    "bg-indigo-600",
  ];
  return (
    <header
      className={cn(
        "sticky w-full flex top-0 z-[51] gap-2 mb-4 items-center h-28 py-2 px-5",
        isUnlocked && backgrounds[index % backgrounds.length],
        !isUnlocked && "bg-neutral-600 text-neutral-300"
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
          <p className="opacity-80">{description}</p>
          {xpNeeded && !isUnlocked && (
            <p className="font-semibold  text-xs bg-emerald-500/50 p-2 rounded-tl-lg rounded-br-lg">
              {xpNeeded}xp
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
