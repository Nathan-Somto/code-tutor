import axios from "axios";

import React from "react";
import { useParams } from "react-router-dom";

import ReactMarkdown from "../../components/ReactMarkdown";
import Ide from "@/components/IDE";
import {
  Code,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  UploadIcon,
} from "lucide-react";
import { cn } from "@/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useKeyboardShortCut } from "@/hooks/useKeyboardShortCut";
import { TerminalProps } from "@/components/IDE/types";
import { Spinner } from "@/components/ui/spinner";
function CodeChallenge() {
  // when should i store the user's solution?
  // test the user's code
  // check if the user passed
  // show submit button if they passed (show run tests otherwise)
  // when they submit, store
  const { levelId } = useParams();
  const [testCases, setTestCases] = React.useState<TerminalProps["testCases"]>(
    []
  );
  const [output, setOutput] = React.useState("");
  const [codeContent, setCodeContent] = React.useState("");
  const [processingCode, setProcessingCode] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [markdownData, setMarkdownData] = React.useState<string>("");
  const [maximize, setMaximize] = React.useState<boolean>(false);
  const [fetching, setFetching] = React.useState<boolean>(false);
  const baseCode = React.useRef<string>("");
  const Langauge = "Python";
  function handleChange(value: string | undefined, _event: unknown) {
    setCodeContent(value ?? "");
  }
  async function handleRun() {
    setProcessingCode(true);
    try {
      const response = await axios.post(`http://localhost:8080/run-code`, {
        language: "py",
        code: codeContent,
        input: "",
      });
      setOutput(response.data.output);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      }
    } finally {
      setProcessingCode(false);
    }
  }
  async function handleSubmitCick() {
    setSubmitting(true);
    try {
      // send code to test code endpoint
      //
    } catch (err) {
    } finally {
      setSubmitting(false);
    }
  }
  function handleMaximizeClick() {
    setMaximize((prevState) => !prevState);
  }
  function handleResetClick() {
    setCodeContent(baseCode.current);
  }
  function handleOutputReset() {
    setOutput("");
  }
  React.useEffect(() => {
    async function fetchData() {
      setFetching(true);
      try {
        //@Todo: change hard-code to actual fetching of  files from level endpoint.
        const folderName = levelId === "1234567" ? "sorting-test" : "print-test"
        const starterCode = await axios.get(
          `http://localhost:8080/code-challenge/${folderName}/starter-code`
        );
        baseCode.current = starterCode.data;
        setCodeContent(starterCode.data);
        const markdown = await axios.get(
          `http://localhost:8080/code-challenge/${folderName}/challenge`
        );
        setMarkdownData(markdown.data as string);
      } catch (err) {
        console.log((err as Error).message);
      } finally {
        setFetching(false);
      }
    }

    fetchData();
    return () => {
      baseCode.current = "";
    };
  }, []);
  useKeyboardShortCut({
    key: "w",
    callback: handleResetClick,
  });
  useKeyboardShortCut({
    key: "`",
    callback: handleRun,
    options: {
      asyncCallback: true,
    },
  });
  useKeyboardShortCut({
    key: "Enter",
    callback: handleSubmitCick,
    options: {
      asyncCallback: true,
    },
  });
  useKeyboardShortCut({
    key: "m",
    callback: handleMaximizeClick,
  });
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={20}
        className=" z-[99999] border-r relative bg-background border-gray-400  h-screen overflow-y-auto flex-shrink-0 min-h-screen py-5 px-4"
      >
        <div>
          {fetching || !markdownData ? (
            <Spinner
              variant="round"
              withContainer
              containerBackground="transparent"
              containerType="center"
              color="foreground"
            />
          ) : (
            <ReactMarkdown markdown={markdownData} />
          )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={80}
        className={cn(
          "",
          maximize && "fixed inset-0 pt-0 z-[99999999] w-full ml-0 h-screen"
        )}
      >
        <div>
          <div className="w-full bg-background flex justify-between items-center  px-7 border-b py-3 border-grey-800">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <Code className="text-green-600" size={20} />
                <p className="font-mono">Code</p>
              </div>
              <p className="font-medium leading-4">{Langauge}</p>
            </div>
            <div className="flex items-center gap-5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="text-white"
                      onClick={handleRun}
                      variant="secondary"
                      disabled={processingCode || submitting}
                    >
                      {processingCode ? (
                        <Spinner size='sm'/>
                      ) : (
                        <>
                          <Play size={16} className="mr-1.5" /> Run
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Run Code <kbd>Ctrl</kbd> + <kbd>`</kbd>{" "}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="text-white/90"
                      disabled={processingCode || submitting}
                      onClick={handleSubmitCick}
                    >
                      {submitting ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          {" "}
                          <UploadIcon size={16} className="mr-1.5" /> Submit
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Submit Code <kbd>Ctrl</kbd> + <kbd>ENTER</kbd>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleMaximizeClick}
                    >
                      {!maximize ? (
                        <Maximize2 size={18} />
                      ) : (
                        <Minimize2 size={18} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {maximize ? "Minimize" : "Maximize"} Editor{" "}
                      <kbd>Ctrl</kbd> + <kbd>M</kbd>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleResetClick}
                    >
                      <RefreshCw size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Reset Code <kbd>Ctrl</kbd> + <kbd>W</kbd>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <Ide
            langauge={Langauge}
            value={codeContent}
            handleChange={handleChange}
            readOnly={processingCode || submitting}
            terminalOptions={{
              output,
              maximized: maximize,
              handleOutputReset,
              currentValue: `${testCases.length ? "testCases" : "output"}`,
              testCases,
            }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeChallenge;
