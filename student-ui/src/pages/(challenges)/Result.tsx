import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import ResultScreen from "@/components/result";
import StreaksScreen from "@/components/streaks";
import BadgesScreen from "@/components/badges/screen";
import { StreakNumber } from "@/providers/RootProvider";
import { BadgesData } from "@/components/badges/data";
import { Rank } from "@/components/rank";
import RankScreen from "@/components/rank/screen";
type ResultData = {
  result: {
    xpGained: number;
    hintsUsed: number;
    gemsGained: number;
  };
  streaks?: {
    currentStreak: number;
    currentDay: number;
    streakDays: StreakNumber[];
  };
  badge?: {
    image: string;
    name: string;
    description: string;
  };
  rank?: {
    newRank: keyof typeof Rank;
  };
};
type Screen = "result" | "streaks" | "rank" | "badge";
export default function ResultPage() {
  const navigate = useNavigate();
  const hints = 4;
  const { courseId, levelId } = useParams();
  const [params] = useSearchParams();
  const [screen, setScreen] = React.useState<Screen>("result");
  const [data, setData] = React.useState<ResultData | null>(null);
  const availableKeys = React.useRef<Screen[]>([]);

  // screen(1): Result -> total xp, hints left (shown), gems gained
  // screen(2): Streaks (if user has unlocked streak by completing this challenge)
  // screen(3): Badge unlocked (show the badge a user has unlocked by completing challenge)
  React.useEffect(() => {
    let badge = BadgesData[2];
    // fetch the result data from the backend
    const data: ResultData = {
      result: {
        xpGained: 30,
        hintsUsed: 5 - hints,
        gemsGained: 5,
      },
      streaks: {
        currentStreak: 8,
        currentDay: new Date().getDay(),
        streakDays: [1, 1, 1, 1, 1, 1, 0],
      },
      badge: {
        image: badge.image,
        name: badge.name,
        description: badge.description,
      },
      rank: {
        newRank: "Expert",
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
      if (params.get("type") === "code") {
        // allow the user to see other code submissions
        navigate(`/challenge/${courseId}/level/${levelId}/code-submissions`);
        return;
      }
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
        <ResultScreen
          type={
            params.get("type") as Parameters<typeof ResultScreen>[0]["type"]
          }
          xpGained={data.result.xpGained}
          hintsUsed={data.result.hintsUsed}
          gemsGained={data.result.gemsGained}
        />
      ) : screen === "badge" ? (
        <BadgesScreen
          badge={
            data?.badge ?? {
              description: "",
              image: "",
              name: "",
            }
          }
        />
      ) : screen === "rank" ? (
        <RankScreen newRank={data?.rank?.newRank ?? "Hard"} />
      ) : screen === "streaks" ? (
        <div className="flex items-center justify-center flex-col h-[80vh]">
          <StreaksScreen
            currentCount={data?.streaks?.currentStreak ?? 0}
            currentDay={data?.streaks?.currentDay ?? 0}
            streakDays={data?.streaks?.streakDays ?? []}
            playAnimation
          /> 
        </div>
        ) : <p></p>
}
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
