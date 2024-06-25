import { cn } from "@/utils";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import Courses from "../../assets/sidebar/courses.svg";
import Leaderboard from "../../assets/sidebar/leaderboard.svg";
import Learn from "../../assets/sidebar/learn.svg";
import Quests from "../../assets/sidebar/quests.svg";
import { RootProps, useRoot } from "@/providers/RootProvider";
type Props = {
  className?: string;
};
const data: Parameters<typeof SidebarItem>[number][] = [
  {
    href: "/courses",
    iconSrc: Courses,
    label: "Courses",
    imgAlt: "courses icon",
  },
  {
    href: "/learn",
    iconSrc: Learn,
    label: "Learn",
    imgAlt: "learn icon",
  },
  {
    href: "/leaderboard",
    iconSrc: Leaderboard,
    label: "Leaderboard",
    imgAlt: "leaderboard icon",
  },
  {
    href: "/quests",
    iconSrc: Quests,
    label: "Quests",
    imgAlt: "quests icon",
  },
];
export default function Sidebar({ className = "" }: Props) {
  // const currentCourse = { id: "1234567", label: "python" };
  const {data:{currentCourse}} = useRoot() as RootProps;
  console.log("currentCourse", currentCourse);
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] py-3 lg:fixed left-0 top-0 border-slate-300 dark:border-slate-700 px-4 lg:border-r-2 flex-col",
        className
      )}
    >
      <Link
        to={`/learn/${currentCourse}`}
        className="py-3  tracking-tighter text-2xl mb-5 block font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-indigo-500 to-purple-500"
      >
        Code Tutor
      </Link>
      <div className="space-y-3">
        {data.map((item) => {
          if (item.label !== "Learn") {
            return <SidebarItem {...item} key={item.href} />;
          }
          if(currentCourse === null && item.label === "Learn")
            {
            return null;
          }
          else {
            return (
              <SidebarItem
                {...item}
                href={item.href + "/" + currentCourse}
                key={item.href}
              />
            );
          }      
        })}
        <SidebarItem
          href="/profile/johndoe123"
          imgAlt="profile icon"
          username="johndoe123"
          label="Profile"
        />
      </div>
    </div>
  );
}
