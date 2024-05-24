import { Button } from "../ui/button";
import LightBulb from "@/assets/hints.svg";
import { cn } from "@/utils";
import React from "react";
const MAX_NUMBER_OF_HINTS = 5;
type Props = {
  hintsLeft: number;
  hintsRefreshDate: Date | null;
  handleClick?: () => void;
  className?: string;
};
export default function HintsButton({
  hintsLeft,
  hintsRefreshDate,
  handleClick,
  className=''
}: Props) {
  const timerId = React.useRef<NodeJS.Timeout | undefined>();
  const [timeLeft, setTimeLeft] = React.useState("00:00:00");
  const [timerHasStarted, setTimerHasStarted] = React.useState(false);
  const [hints, setHints] = React.useState(hintsLeft);
  React.useEffect(() => {
    //@Todo: stop the timer when i unmount.
    if (hints === 0 && hintsRefreshDate !== null) {
      setTimerHasStarted(true);
      startTimer();
    }
    return () => {
      if (timerId.current && timerHasStarted) {
        clearInterval(timerId.current);
      }
    };
  }, [hints]);
  function startTimer() {
    if (hintsRefreshDate === null) return;
    // timer format: hh:mm:ss
    // count till we reach hintsRefreshDate
    const id = setInterval(() => {
      console.log("timer started!");
      const now = new Date();
      const timeDiff = hintsRefreshDate.getTime() - now.getTime();
      if (timeDiff <= 0) {
        setTimerHasStarted(false);
        setHints(MAX_NUMBER_OF_HINTS);
        clearInterval(id);
      }
      let hours = Math.abs(hintsRefreshDate.getHours() - now.getHours())
        .toString()
        .padStart(2, "0");
      let minutes = Math.abs(hintsRefreshDate.getMinutes() - now.getMinutes())
        .toString()
        .padStart(2, "0");
      let seconds = Math.abs(hintsRefreshDate.getSeconds() - now.getSeconds())
        .toString()
        .padStart(2, "0");
      const format = `${hours}:${minutes}:${seconds}`;
      setTimeLeft(format);
    }, 1000);
    timerId.current = id;
    return id;
  }
  return (
    <Button
      disabled={timerHasStarted}
      onClick={handleClick}
      variant="transparent"
      className={cn("font-bold text-lg text-accent gap-x-1", className)}
    >
      <span>{timerHasStarted ? timeLeft : hints}</span>
      <img
        src={LightBulb}
        alt="light-bulb"
        className="h-5 w-5 object-contain"
      />
    </Button>
  );
}
