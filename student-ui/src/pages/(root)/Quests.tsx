import questIcon from "@/assets/sidebar/quests.svg";
import { Separator } from "@/components/ui/separator";
import badgesData from "@/data/sample-curriculum/quests.json";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils";
import { Check } from "lucide-react";
import {imageMap} from "@/components/badges/data";
export default function Quests() {
    
  return (
    <div>
      <header className="text-center my-6">
        <img
          src={questIcon}
          alt="leaderboard icon"
          className="size-[90px] mb-3 mx-auto"
        />
        <h1 className="font-bold text-3xl mb-1 leading-relaxed">Quests</h1>
        <p className="w-[80%] mx-auto opacity-80 text-lg">
          {/* write something on quests */}
          Check out your progress on quests
        </p>
      </header>
      <Separator />
      <div className="space-y-6 px-6 my-8">
        {badgesData.map((badge, index) => (
          <div
            key={index}
            className={cn(" rounded-lg relative p-6 border  shadow-md flex flex-col  w-full", badge.achieved && "border-green-500 border-2")}
          >{
            badge.achieved && (
             <div className="rounded-md absolute top-3 right-2 bg-primary flex items-center justify-center p-1.5">
            <Check className="text-white stroke-[4] h-4 w-4" />
          </div>
            )
          }
            <img
              src={imageMap[badge.Badge.image as keyof typeof imageMap]}
              alt={badge.Badge.name}
              className="w-20 h-20 mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2">{badge.Badge.name}</h2>
            <p className=" text-sm text-gray-600 mb-4">
              {badge.Badge.description}
            </p>
            {!badge.achieved && (
            <div>
              <span className="text-xs text-gray-500  leading-none py-1">
                Progress
              </span>
              <Progress value={badge.progress} />
            </div>
            )}
        </div>
        ))}
      </div>
    </div>
  );
}
