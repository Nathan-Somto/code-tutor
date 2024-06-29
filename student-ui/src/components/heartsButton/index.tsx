import { Button } from "../ui/button";
import Heart from "@/assets/heart.svg";
import { MAX_HEARTS_COUNT } from "@/constants";
import { cn } from "@/utils";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";

type Props = {
  heartsLeft: number;
  heartsRefreshDate: Date | null;
  className?: string;
};

export default function HintsButton({
  heartsLeft,
  heartsRefreshDate,
  className = ''
}: Props) {
  const timerId = React.useRef<NodeJS.Timeout | undefined>();
  const [timeLeft, setTimeLeft] = React.useState("00:00:00");
  const [timerHasStarted, setTimerHasStarted] = React.useState(false);
  const [hearts, setHearts] = React.useState(heartsLeft);

  React.useEffect(() => {
    if (hearts === 0 && heartsRefreshDate !== null) {
      setTimerHasStarted(true);
      startTimer();
    }
    return () => {
      if (timerId.current && timerHasStarted) {
        clearInterval(timerId.current);
      }
    };
  }, [hearts]);

  React.useEffect(() => {
    if (heartsRefreshDate !== null) {
      localStorage.setItem("heartsRefreshDate", heartsRefreshDate.toISOString());
    }
  }, [heartsRefreshDate]);

  React.useEffect(() => {
    const storedDate = localStorage.getItem("heartsRefreshDate");
    if (storedDate) {
      const parsedDate = new Date(storedDate);
      if (parsedDate > new Date()) {
        setTimerHasStarted(true);
        startTimer(parsedDate);
      } else {
        localStorage.removeItem("heartsRefreshDate");
      }
    }
  }, []);

  function startTimer(date?: Date) {
    const refreshDate = date || heartsRefreshDate;
    if (refreshDate === null) return;

    const id = setInterval(() => {
      const now = new Date();
      const timeDiff = refreshDate.getTime() - now.getTime();
      if (timeDiff <= 0) {
        setTimerHasStarted(false);
        setHearts(MAX_HEARTS_COUNT);
        localStorage.removeItem("heartsRefreshDate");
        clearInterval(id);
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000).toString().padStart(2, "0");

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    timerId.current = id;
    return id;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={timerHasStarted}
          variant="transparent"
          className={cn("font-bold text-lg text-rose-500 gap-x-1", className)}
        >
          <span>{timerHasStarted ? timeLeft : hearts}</span>
          <img src={Heart} alt="hearts" className="h-5 w-5 object-contain" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="p-4 text-center">
          <img src={Heart} alt="hearts" className="h-16 w-16 object-contain mx-auto mb-2" />
          <p>
            Hearts ensure that you pay attention to the questions you select during quizzes.
            A failed question results in a deduction of hearts. When you run out, you have to wait
            5 minutes for them to replenish.
          </p>
          <p className="font-bold mt-2">Current hearts: {hearts}</p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
