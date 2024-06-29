import { Button } from "@/components/ui/button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React from "react";
import { Spinner } from "@/components/ui/spinner";
import GainsScreen from "@/components/gains";
import StreaksScreen from "@/components/streaks";
import BadgesScreen from "@/components/badges/screen";
// sample badges data
// import { BadgesData } from "@/components/badges/data";
import RankScreen from "@/components/rank/screen";
import { LevelType } from "@/types";
import { useChallenge } from "@/providers/ChallengesProvider";
type Screen = "gains" | "streaks" | "rank" | "badges";
/** 
 *  sample result data response
 *  {
      gains: {
        xpGained: 30,
        gemsGained: 5,
      },
      streaks: {
        currentCount: 8,
        currentDate: new Date(),
        history: [1, 1, 1, 1, 1, 1, 0],
        currentStatus: 0
      },
      badges: {
        image: badge.image,
        name: badge.name,
        description: badge.description,
      },
      rank: "Expert",
    
    };
*/
export default function ResultPage() {
  const navigate = useNavigate();
  const { courseId, levelId } = useParams();
  const [params] = useSearchParams();
  const [screen, setScreen] = React.useState<Screen>("gains");
  console.log(screen)
  const availableKeys = React.useRef<Screen[]>([]);
  const { resultData: data,  } = useChallenge();
  // screen(1): Gains -> total xp gained,  gems gained
  // screen(2): Streaks -> if user has achieved their streak by completing this challenge
  // screen(3): Badge unlocked -> show the badge a user has unlocked by completing challenge
  // screen(4): Rank -> the user has attained a new rank
  React.useEffect(() => {
    // fetch the result data from the backend
    if (data !== null) {
      // get the available keys from result data and store in a ref
      availableKeys.current = Object.keys(data).filter(
        (key) => key !== "gains"
      ) as Screen[];
    }
  }, [data]);
  function handler() {
    if (availableKeys.current.length > 0) {
      const key = availableKeys.current.shift();
      setScreen(key as Screen);
    } else {
      if (params.get("type")?.toLowerCase() === "code") {
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
      {screen === "gains" ? (
        <GainsScreen
          type={params.get("type") as LevelType}
          xpGained={data.gains.xpGained}
          gemsGained={data.gains.gemsGained}
        />
      ) : screen === "badges" ? (
        <BadgesScreen
          badge={
            data?.badges ?? {
              description: "",
              image: "",
              name: "",
            }
          }
        />
      ) : screen === "rank" ? (
        <RankScreen newRank={data?.rank ?? "Hard"} />
      ) : screen === "streaks" ? (
        <div className="flex items-center justify-center flex-col h-[80vh]">
          <StreaksScreen
            currentCount={data?.streaks?.currentCount ?? 0}
            currentDay={new Date(data?.streaks?.currentDate ?? '')?.getDay() ?? 0}
            streakDays={data?.streaks?.history ?? []}
            currentStatus={data?.streaks?.currentStatus ?? 0}
            playAnimation
          />
        </div>
      ) : (
        <p></p>
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
