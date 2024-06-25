import { cn } from "@/utils";
import { Link, useLocation } from "react-router-dom";

type Props = {
  href: string;
  iconSrc?: string;
  imgAlt: string;
  label: string;
  username?: string;
};
export default function SidebarItem({
  href,
  iconSrc,
  imgAlt,
  label,
  username,
}: Props) {
  const { pathname } = useLocation();
  return (
    <Link
      to={href}
      className={cn(
        "flex px-5 gap-3 tracking-wide items-center hover:bg-secondary/40 dark:hover:bg-slate-900 h-[52px] rounded-md py-3",
        (href === pathname || href.includes(pathname)) &&
          "dark:text-secondary dark:hover:text-secondary text-white/90 bg-secondary/90 hover:bg-secondary/70 dark:bg-slate-900 border border-secondary font-medium"
      )}
    >
      {label === "Profile" ? (
        <div className="border-dotted border-slate-500 border-[3px]  p-2 h-8 w-8  rounded-full justify-center flex items-center text-slate-500 uppercase">
          <span>{username && username[0]}</span>
        </div>
      ) : (
        <img className="h-8 w-8" src={iconSrc} alt={imgAlt} />
      )}
      <span>{label}</span>
    </Link>
  );
}
