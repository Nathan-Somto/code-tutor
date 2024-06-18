import { cn } from "@/utils";
import Hints from "@/assets/hints.svg";
import Thunder from "@/assets/thunder.svg";
import Diamond from "@/assets/diamond.svg";
type Props = {
  variant: "hints" | "xp" | "gems";
  value: number;
};
export default function ResultCard({ variant, value }: Props) {
  const imgSrc = variant === "hints" ? Hints :  variant === "gems" ? Diamond : Thunder;
  return (
    <div
      className={cn(
        "rounded-2xl border-2 w-full ",
        variant === "hints" && "bg-accent/90 border-accent/90",
        variant === "xp" &&
          "bg-green-500 border-green-500",
          variant === "gems" && "bg-sky-500 border-sky-500"
      )}
    >
      <div className="p-1.5 uppercase rounded-t-xl text-center text-xs dark:text-white/90 font-semibold">
        {variant === "hints" ? "Hints Used" : variant ==="gems" ? "Earned Gems" : "Total XP"}
      </div>
      <div
        className={cn(
          "items-center justify-center rounded-2xl gap-2 flex text-lg font-bold bg-background p-6",
          variant === "hints" && "text-accent/90",
          variant === "xp" && "text-green-500",
          variant === "gems" && "text-sky-500"
        )}
      >
        <img
          src={imgSrc}
          alt={`${variant === "hints" ? "hints" : variant ==="gems" ? "gems" : "xp"} icon`}
          className="h-6 w-6"
        />
        <p>{value}</p>
      </div>
    </div>
  );
}
