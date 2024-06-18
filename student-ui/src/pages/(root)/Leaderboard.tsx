import { Separator } from "@/components/ui/separator";
import Leaderboard from "../../assets/sidebar/leaderboard.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RankComponent from "@/components/rank"
const leaderboardData = {
  data: [
    {
      username: "davy jones",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg",
      xp: 3450,
      rank: "Expert",
      id: 1234,
    },
    {
      username: "jane doe",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      xp: 3400,
      id: 5678,
      rank: "Advanced"
    },
    {
      username: "mike1234",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      xp: 3380,
      id: 1678,
      rank:"Hard"
    },
    {
      username: "iam_kate21",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      xp: 3360,
      id: 1278,
      rank : "Medium"
    },
    {
      username: "jon21b",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      xp: 330,
      id: 1290,
      rank : "Easy"
    },
  ],
  pages: 1,
  page: 1,
  size: 10,
};
export default function LeaderboardPage() {
  return (
    <div>
      <header className="text-center my-6">
        <img
          src={Leaderboard}
          alt="leaderboard icon"
          className="size-[90px] mb-3 mx-auto"
        />
        <h1 className="font-bold text-3xl mb-1 leading-relaxed">Leaderboard</h1>
        <p className="w-[80%] mx-auto opacity-80 text-lg">
          See how you rank amongst other people in the community.
        </p>
      </header>
      <Separator />
      <div className="max-w-4xl mx-auto space-y-3 mt-6 px-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-x-8 flex-[0.7]">
          <div>S/N</div>
          <div>Username</div>
          </div>
          <div className="max-w-16 w-16 ">Rank</div>
          <div className="max-w-16 w-16 " >XP</div>
        </div>
        {leaderboardData.data.map((item, index) => (
          <Link
            to={`/profile/${item.username}`}
            key={item.id}
            className="flex items-center rounded-xl justify-between px-4 py-2 hover:bg-slate-800"
          >
            <div className="flex items-center flex-[0.7]">
              <p className="font-semibold mr-4 text-sm">#{index + 1}</p>
              <Avatar className="border-2 size-12 bg-green-600">
                <AvatarImage
                  src={item.avatar}
                  alt={`${item.username} avatar`}
                />
                <AvatarFallback className="uppercase">
                  {item.username[0] + item.username[1]}
                </AvatarFallback>
              </Avatar>
              <p className="font-bold ml-3">{item.username}</p>
            </div>
            <div className="max-w-16 w-16 flex-shrink-0">
              <RankComponent rank={item.rank} size={32}/>
            </div>
            <p className="opacity-80 max-w-16 w-16">{item.xp}Xp</p>
          </Link>
        ))}
      
      <div className="flex items-center gap-3 mt-3 justify-center">   
        <Button size="icon" className='size-8'>
            <ChevronLeft/>
        </Button>
        <p>
            <span className="opacity-80">{leaderboardData.page}</span>
            {' '}of{' '}
            <span>{leaderboardData.pages}</span>
        </p>
        <Button size="icon" className='size-8'>
            <ChevronRight/>
        </Button>
      </div>
      </div>
    </div>
  );
}
