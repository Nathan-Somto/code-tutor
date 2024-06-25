import { Rank } from "@/types";

  type ShieldProps  = {
    rank: keyof typeof Rank;
    size?: number; // Size in pixels
  }
  
  const rankStyles = {
    [Rank.Expert]: 'border-[gold] ', 
    [Rank.Advanced]: 'border-slate-500 ',
    [Rank.Hard]: 'border-orange-500 ',
    [Rank.Medium]: 'border-blue-500 ',
    [Rank.Easy]: 'border-green-500 ',
  };
  const values = {
    "Easy": Rank.Easy,
    "Medium": Rank.Medium,
    "Hard": Rank.Hard,
    "Advanced": Rank.Advanced,
    "Expert": Rank.Expert, 
}
  const RankComponent: React.FC<ShieldProps> = ({ rank, size=200 }) => {
    const sizeClasses = {
      height: `${size}px`,
      width: `${size}px`,
      fontSize: `${size - (0.4 * size)}px`
    };
  
    return (
      <div
        className={`flex items-center  p-2 justify-center border-4 text- ${rankStyles[values[rank]]}`}
        style={{
          ...sizeClasses,
          borderRadius: '50% 50% 50% 50% / 12% 12% 88% 88%',
        }}
      >
        <span className="text-center">{values[rank]}</span>
      </div>
    );
  };
  
  export default RankComponent;