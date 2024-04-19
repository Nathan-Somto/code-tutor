import { cn } from "@/utils";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import Courses from "../../assets/sidebar/courses.svg";
import Leaderboard from "../../assets/sidebar/leaderboard.svg";
import Learn from "../../assets/sidebar/learn.svg";
import Quests from "../../assets/sidebar/quests.svg";
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
  const currentCourse = { id: "1234567", label: "python" };
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] py-3 lg:fixed left-0 top-0 border-slate-700 px-4 lg:border-r-2 flex-col",
        className
      )}
    >
      <Link
        to={`/learn/${currentCourse.id}`}
        className="py-3 text-primary tracking-tighter text-2xl mb-5 block"
      >
        Code Tutor
      </Link>
      <div className="space-y-3">
        {data.map((item) => {
          if (item.label !== "Learn") {
            return <SidebarItem {...item} key={item.href} />;
          }
          return (
            <SidebarItem
              {...item}
              href={item.href + "/" + currentCourse.id}
              key={item.href}
            />
          );
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
