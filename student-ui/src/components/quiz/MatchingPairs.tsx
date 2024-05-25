import { Status } from "@/pages/(challenges)/QuizChallenge";
import { Button } from "../ui/button";
import React from "react";
import { cn } from "@/utils";
type Props = {
  pair1: string[];
  pair2: string[];
  handlePairStatus: (key: string, value: string) => void;
  selectedPairs: { [key: string]: "correct" | "wrong" | null };
};
type Pair = {
  key: string | null;
  value: string | null;
};
export default function MatchingPairs({
  pair1,
  pair2,
  handlePairStatus,
  selectedPairs,
}: Props) {
  const [pair, setPair] = React.useState<Pair>({
    key: null,
    value: null,
  });
  React.useEffect(() => {
    if (pair.key !== null && pair.value !== null) {
      handlePairStatus(pair.key, pair.value);
      setPair({
        key: null,
        value: null,
      });
    }
  }, [pair]);
  function handleSelect(key: string | null, value: string | null) {
    setPair({
      key: key ?? pair.key,
      value: value ?? pair.value,
    });
  }
  function className(status: Status, isSelected: boolean) {
    return cn(
      status === "wrong" &&
        "bg-rose-300/90 ring-offset-rose-600 text-rose-600 ring-rose-600 border-rose-600 hover:border-rose-700",
      status === "correct" && "bg-green-300/90 ring-offset-green-600 text-green-600 ring-green-600 border-green-600 hover:border-green-700",
      isSelected && "bg-blue-300/90 text-blue-600 ring-offset-blue-600 ring-blue-600 border-blue-600 hover:border-blue-700",
      "py-6 disabled:opacity-50 disabled:!cursor-not-allowed font-medium text-center"
    );
  }
  return (
    <div className="max-w-3xl mx-auto pb-5">
      <h3 className="mb-6 text-2xl tracking-tight text-center leading-2">
        Select the Matching Pairs
      </h3>
      <div className="grid grid-cols-2 gap-x-10">
        <div className="gap-y-5 flex flex-col">
          {pair1.map((item, index) => (
            <Button
              key={item + index}
              className={className(
                selectedPairs[item] ?? null,
                item === pair.key
              )}
              disabled={selectedPairs[item] === "correct"}
              onClick={() => handleSelect(item, null)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="gap-y-5 flex flex-col">
          {pair2.map((item, index) => (
            <Button
              key={item + index}
              className={className(
                selectedPairs[item] ?? null,
                item === pair.value
              )}
              disabled={selectedPairs[item] === "correct"}
              onClick={() => handleSelect(null, item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
