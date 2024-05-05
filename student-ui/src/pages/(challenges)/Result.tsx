import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import Result from "@/components/result";
type ResultData = {
  result: {
    xpGained: number;
    hintsUsed: number;
  };
  streaks?: {
    currentStreak: number;
    currentDay: Date;
  };
  badge?: {
    badgeImg: string;
    badgeDescription: string;
    neededXp: number;
  };
};
type Screen = "result" | "streaks" | "badge";
export default function ResultPage() {
  const navigate = useNavigate();
  const hints = 4;
  const { courseId, levelId } = useParams();
  const [params] = useSearchParams();
  const [screen, setScreen] = React.useState<Screen>("result");
  const [data, setData] = React.useState<ResultData | null>(null);
  const availableKeys = React.useRef<Screen[]>([]);
  // screen(1): Result -> total xp, hints left (shown)
  // screen(2): Streaks (if user has unlocked streak by completing this challenge)
  // screen(3): Badge unlocked (show the badge a user has unlocked by completing challenge)
  React.useEffect(() => {
    // fetch the result data from the backend
    const data: ResultData = {
      result: {
        xpGained: 30,
        hintsUsed: 5 - hints,
      },
      streaks: {
        currentStreak: 8,
        currentDay: new Date(),
      },
    };
    // get the available keys from result data and store in a ref
    availableKeys.current = Object.keys(data).filter(
      (key) => key !== "result"
    ) as Screen[];
    setData(data);
  }, []);
  async function handler() {
    if (availableKeys.current.length > 0) {
      const key = availableKeys.current.shift();
      setScreen(key as Screen);
    } else {
      navigate(`/learn/${courseId}`);
    }
  }
  if (data === null) {
    return (
      <Spinner
        color="green"
        size="xs"
        variant="dots"
        withContainer
        containerBackground="transparent"
        containerType="full"
      />
    );
  }
  return (
    <div>
      {screen === "result" ? (
        <Result
          xpGained={data.result.xpGained}
          hintsUsed={data.result.hintsUsed}
        />
      ) : screen === "badge" ? (
        "Badge Screen"
      ) : (
        "Streaks Screen"
      )}
      <footer
        className={
          "border-t h-20 bottom-0 bg-background fixed max-w-5xl inset-x-0 w-full mx-auto flex items-center justify-between px-4 "
        }
      >
        <Button
          size="sm"
          className="text-slate-700 lg:h-11 lg:px-8"
          onClick={() =>
            navigate(
              `/challenge/${courseId}/level/${levelId}/${params.get("type")}`
            )
          }
        >
          Practice Again
        </Button>
        <Button
          variant={"primary"}
          onClick={handler}
          size="sm"
          className="text-slate-700 lg:h-11 lg:px-8"
        >
          Continue
        </Button>
      </footer>
    </div>
  );
}
