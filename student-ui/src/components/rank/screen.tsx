import RankComponent, { Rank } from ".";

type Props = {
  newRank: keyof typeof Rank;
};
const values = {
    "Easy": [Rank.Easy, '50% of programmers are in the ', "text-green-500"],
    "Medium": [Rank.Medium,'25% of programmers are in the ', "text-blue-500"],
    "Hard": [Rank.Hard,'15% of programmers are in the ', "text-orange-500"],
    "Advanced": [Rank.Advanced,'9% of programmers are in the ', "text-slate-500" ],
    "Expert": [Rank.Expert, '1% of programmers are in the ', "text-[gold]"]
}
export default function RankScreen({ newRank }: Props) {
  return (
    <div className="mb-10 max-w-5xl mx-auto flex h-[80vh] flex-col items-center justify-center">
      <h1 className="come-up text-center text-3xl font-semibold tracking-wide leading-snug logo-text mb-3">
        New Rank Unlocked!
      </h1>
      <div className="object-reveal text-center flex-col  flex items-center justify-center rounded-md py-2 px-5 max-w-[80%] mx-auto">
       <RankComponent rank={newRank} /> 
       <p className="mt-4 text-lg">{values[newRank][1]} <span className={`font-semibold ${values[newRank][2]}`}>{newRank}</span> Level</p>
      </div>
    </div>
  );
}