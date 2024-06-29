import { useWindowSize } from "@/hooks/useWindowSize";
import Card from "./card";
import Confetti from 'react-confetti';
import { LevelType } from "@/types";
type Props = {
  type?: LevelType;
  xpGained: number;
  //hintsUsed: number;
  gemsGained: number;
};
export default function Gains({
  type = "lesson",
  xpGained,
  //hintsUsed,
  gemsGained
}: Props) {
  const {width, height} = useWindowSize()
  return (
    <>
    <Confetti
    width={width}
    height={height}
    recycle={false}
    numberOfPieces={3000}
    />
    <div className="my-10 text-center max-w-5xl mx-auto">
      <p className="text-7xl mb-4">🎊</p>
      <h2 className="text-accent text-4xl mb-2.5">
        <span className="capitalize font-bold">{type}</span> Complete
      </h2>
      <p className="font-medium">Great job in completing the level!</p>
      <div className="sm:flex items-center space-y-4 sm:space-x-4 sm:space-y-0 mt-7 max-w-sm mx-auto">
        <Card variant="xp" value={xpGained} />
      {/* {type !== 'code' && (<Card variant="hints" value={hintsUsed} />)} */}
       <Card variant="gems"   value={gemsGained}/>
      </div>
    </div>
    </>
  );
}
