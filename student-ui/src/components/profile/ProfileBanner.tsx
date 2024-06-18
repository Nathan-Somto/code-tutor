import Thunder from "@/assets/thunder.svg";
import Fire from "@/assets/Fire.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { PencilIcon } from "lucide-react";
import { formatJoinedAt } from "@/utils/formatJoinedAt";
import RankComponent from "../rank";
export default function ProfileBanner() {
    const user = {
        profilePhoto: '',
        joinedAt: new Date(),
        username: "Nathan-Somto",
        name: "Mkparu Somtochi",
        xpPoints: 3500,
        streakCount: 50,
        rank: "Easy"
    };
    return(
        <div className="2xl:min-h-[396px] pb-5 rounded-3xl px-6 relative flex  gap-8   lg:mt-16 2xl:mt-24">
			<div className="w-28 h-28 2xl:w-32 2xl:h-32 text-2xl 2xl:text-3xl mb-4">
                <Avatar className="h-full w-full">
                    <AvatarFallback>
                        {user?.username[0] + user?.username[1]?.toUpperCase()}
                    </AvatarFallback>
                    <AvatarImage src={user?.profilePhoto} alt={`${user.username ?? ''} profile photo`}className="w-full"/>
                </Avatar>
			</div>
            <div className="text-left">
			<h2 className="font-semibold mb-2.5 text-2xl lg:text-3xl xl:text-4xl">
			    {user?.name}	
			</h2>
			<div className="flex flex-col gap-y-2">
				<h3 className="font-light text-secondary-foreground lg:text-lg 2xl:text-xl">
					{user?.username}
				</h3>
                <div className="flex gap-x-4 items-center">
				<div className="flex gap-x-1 items-center">
					<img src={Thunder} alt="xp-icon" width={24} />
					<span className="font-semibold text-[gold] text-sm">{user?.xpPoints}</span>
				</div>
                <div className="flex gap-x-1 items-center">
                <img
                src={Fire}
                alt="streaks icon"
                className="h-5 w-5 object-contain"
              />
              <span className="from-orange-600 font-semibold to-yellow-600 text-base bg-clip-text text-transparent bg-gradient-to-r">
                {user?.streakCount}
              </span>
                </div>
                <div>
                    <RankComponent rank={user.rank} size={24}/>
                </div>
                </div>
				<p className="font-light text-white/70 text-xs">
					Joined at <span className="font-medium">{formatJoinedAt(user?.joinedAt?.toISOString() ?? '')}</span>
				</p>
			</div>
            </div>
            <div className="absolute top-0 right-2">
                <Button size="icon" className="size-8">
                    <PencilIcon size={18}/>
                    <span className="sr-only">Edit Profile</span>
                </Button>
            </div>
		</div>
    )
}