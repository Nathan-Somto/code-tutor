import ReactMarkdown from "../ReactMarkdown";
import { cn } from "@/utils";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
type Props = {
  question: string;
  code: string;
  values?: {
    [x: number]: string;
  };
  status: "correct" | "wrong" | null;
  handleBlockSelect: (value: number) => void;
};
export function CompleteSequence({
  question,
  code,
  values,
  status,
  handleBlockSelect,
}: Props) {
  return (
    <div>
      <ReactMarkdown markdown={question} />
      <div className="bg-[rgb(30_30_30)] py-3 px-4">
        {code.split(" ").map((item, index) => {
          if (/\${[0-9]+}/g.test(item)) {
            /* get the number in between ${} */
            let match = item.match(/[0-9]+/g);
            const value = match !== null ? +match[0] : -1;
            const option =
              values !== undefined ? values[value] ?? undefined : undefined;
            return (
              <span
                key={index}
                onClick={() => option && handleBlockSelect(value)}
                className={cn(
                  "inline-block  min-h-5 min-w-5 px-1 text-center rounded-sm hover:scale-125 border-slate-500  border-2 text-sm font-bold cursor-pointer",
                  status === "wrong" && "border-rose-600 text-rose-500",
                  status === "correct" && "border-green-600 text-green-500"
                )}
              >
                {option}
              </span>
            );
          } else {
            return (
              <SyntaxHighlighter
                children={item.split("/-").join(" ")}
                PreTag="pre"
                language={"py"}
                style={vscDarkPlus}
                key={item + index}
                className="!whitespace-break-spaces !inline !bg-transparent"
              />
            );
          }
        })}
      </div>
    </div>
  );
}