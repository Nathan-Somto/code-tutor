import { LockIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatJoinedAt } from "@/utils/formatJoinedAt";
import { imageMap } from "./data";
import { useNavigate } from "react-router-dom";

export type BadgesType = {
    name: string;
    description: string;
    image: string;
    achievementDate: Date  | string;
    xTimes: number;
}
type Props ={
    badges: BadgesType[]
}
export default function Badges({badges}: Props){
  const navigate = useNavigate();
    return (
        <>
         { badges.length > 0  ? (badges.map((badge) => (
            <DropdownMenu  key={badge.image}>
              <DropdownMenuTrigger asChild>
                <Button size="rounded" variant="ghost" className="size-16 items-center justify-center relative p-2 border-2 hover:opacity-50">
                <img
                src={imageMap[badge.image as keyof typeof imageMap]}
                className={`size-14 mx-auto  cursor-pointer object-contain  `}
              />
              {badge.xTimes > 1 && (
                <div className="absolute -bottom-2 right-0 px-2 rounded-md text-sm bg-teal-500 fonst-medium">
                <span>X{badge.xTimes}</span>
              </div>
              )}
              
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-2 py-3">
                <h2 className="text-xl font-semibold tracking-tighter leading-normal mb-2">{badge.name}</h2>
                <p className="leading-none py-1 opacity-80">{badge.description}</p>
                <div>
                  <p className="gap-x-2 flex items-center"><LockIcon/><span>unlocked</span></p> 
                  <p>{formatJoinedAt(badge.achievementDate.toString())}</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
                ))) : (
                  <div className="mt-3 px-2">
                    <p className="font-medium opacity-80 tracking-tight leading-snug">Check the Quest Page for available badges and how to unlock them.</p>
                    <Button variant="secondary" className="mt-3" onClick={() => navigate('/quests')}>Check now</Button>
                  </div>
                )}
        </>
       
    )
}