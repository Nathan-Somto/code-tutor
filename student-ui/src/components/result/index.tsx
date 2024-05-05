import { useWindowSize } from "@/hooks/useWindowSize";
import Card from "./card";
import Confetti from 'react-confetti';
type Props = {
  type?: "lesson" | "quiz" | "code";
  xpGained: number;
  hintsUsed: number;
};
export default function Result({
  type = "lesson",
  xpGained,
  hintsUsed,
}: Props) {
  const {width, height} = useWindowSize()
  return (
    <>
    <Confetti
    width={width}
    height={height}
    recycle={false}
    numberOfPieces={3000}
    tweenDuration={10000}
    />
    <div className="my-10 text-center max-w-5xl mx-auto">
      <p className="text-7xl mb-4">🎊</p>
      <h2 className="text-accent text-4xl mb-2.5">
        <span className="capitalize font-bold">{type}</span> Complete
      </h2>
      <p className="font-medium">Great job in completing the level!</p>
      <div className="sm:flex items-center space-y-4 sm:space-x-4 sm:space-y-0 mt-7 max-w-sm mx-auto">
        <Card variant="xp" value={xpGained} />
        <Card variant="hints" value={hintsUsed} />
      </div>
    </div>
    </>
  );
}
