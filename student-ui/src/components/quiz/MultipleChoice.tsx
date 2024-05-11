import ReactMarkdown from "../ReactMarkdown";
import { Button } from "../ui/button";
import { cn } from "@/utils";
type Props = {
  question: string;
  options: string[];
  selectedOption: string;
  status: "correct" | "wrong" | null;
  handleSelect: (option: string) => void;
};
export function MultipleChoice({
  question,
  options,
  status,
  handleSelect,
  selectedOption,
}: Props) {
  return (
    <div>
      {/* <p className="text-center mb-8 text-xl font-medium">{question}</p> */}
      <ReactMarkdown
        markdown={question}
        pClassName="text-center lg:text-xl font-medium text-lg"
        codeClassName="mt-3 max-w-lg !mx-auto"
      />
      <div className="max-w-lg mx-auto my-8 gap-8 flex flex-col">
        {options.map((option, index) => (
          <Button
            key={option + index}
            className={cn(
              selectedOption === option &&
                status === "wrong" &&
                "bg-rose-300/90 ring-offset-rose-600 text-rose-600 ring-rose-600 border-rose-600 hover:border-rose-700",
              selectedOption === option &&
                status === "correct" &&
                "bg-green-300/90 ring-offset-green-600 text-green-600 ring-green-600 border-green-600 hover:border-green-700",
              selectedOption === option &&
                status === null &&
                "bg-blue-300/90 text-blue-600 ring-offset-blue-600 ring-blue-600 border-blue-600 hover:border-blue-700",
              "justify-between py-6 disabled:opacity-100 disabled:cursor-no-action font-medium"
            )}
            disabled={status === "correct"}
            onClick={() => handleSelect(option)}
          >
            <div
              className={cn(
                "border px-4 py-2 rounded-lg border-slate-600 ring-offset-slate-600",
                selectedOption === option &&
                  status === null &&
                  "ring-offset-blue-600 border-2 ring-blue-600 border-blue-600",
                selectedOption === option &&
                  status === "correct" &&
                  "ring-offset-green-600 border-2 ring-green-600 border-green-600",
                selectedOption === option &&
                  status === "wrong" &&
                  "ring-offset-rose-600 border-2 ring-rose-600 border-rose-600"
              )}
            >
              {index + 1}
            </div>
            <div className="text-center mx-auto flex-[0.8]">{option}</div>
          </Button>
        ))}
      </div>
    </div>
  );
}
