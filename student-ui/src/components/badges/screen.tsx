import { imageMap } from "./data";
type Props = {
  badge: {
    description: string;
    name: string;
    image: string;
  };
};
export default function BadgesScreen({ badge }: Props) {
  return (
    <div className="my-10 max-w-5xl mx-auto">
      <h1 className="come-up text-center text-3xl font-semibold tracking-wide leading-snug logo-text mb-3">
        New Badge Unlocked!
      </h1>
      <div className="object-reveal text-center rounded-md py-2 px-5 max-w-[80%] mx-auto">
        <div className="border-[3px] p-2 size-44 mx-auto rounded-full overlow-hidden mb-3 flex items-center justify-center">
        <img
          className="size-[90%] object-contain"
          src={imageMap[badge.image as keyof typeof imageMap]}
          alt="badge"
        />
        </div>
        <h2 className="font-medium mb-2 text-xl">{badge.name}</h2>
        <p className="opacity-80 text-sm">{badge.description}</p>
      </div>
    </div>
  );
}
