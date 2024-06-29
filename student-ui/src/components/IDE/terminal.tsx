import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { cn } from "@/utils";
import {
  AlertCircle,
  CheckCircle2Icon,
  ChevronDown,
  ChevronRight,
  ListX,
  X,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useKeyboardShortCut } from "@/hooks/useKeyboardShortCut";
import { ResizableHandle, ResizablePanelGroup, ResizablePanel } from "../ui/resizable";
import {TerminalProps} from "./types";

export default function Terminal({
  currentValue = "testCases",
  output,
  testCases = [],
  maximized,
  handleOutputReset
}: TerminalProps) {
  const sampleTestCases: TerminalProps["testCases"] = [
    {
      input: "[]",
      description: "must be an empty array",
      expectedOutput: "[]",
      output: "[-1]",
      passed:false,
  },
  {
      input: "[1,2,3,4,5,9]",
      output: "[1,2,3,4,5,9]",
      description: "must be a sorted array",
      expectedOutput: "[1,2,3,4,5,9]",
      passed: true
  },
  ]
  console.log("the testCases", testCases)
  //console.log(sampleTestCases)
  const [closeTerminal, setCloseTerminal]= React.useState<boolean>(false);
  const [currTestCase, setCurrTestCase] = React.useState(-1);
  const numberOfPassed = React.useMemo(
    () => testCases.filter((testCase) => testCase.passed).length,
    [testCases]
  );
  const numberOfFailed = React.useMemo(
    () => testCases.length - numberOfPassed,
    [testCases]
  );
  function handleTerminalClose(){
    setCloseTerminal(prevState => !prevState);
  }
  useKeyboardShortCut({
    callback: handleTerminalClose,
    key: 'i'
  })
  return (
    <ResizablePanelGroup direction="vertical"  >
      <div className={cn(
        "fixed bottom-0 w-full left-0  block z-[99999] h-[180px] shadow-lg bg-gray-300 dark:bg-[hsl(214,41%,3%)]  !overflow-y-auto",
        maximized && "w-full ml-0",
        closeTerminal && "hidden"
      )}>
        <ResizableHandle />
      <ResizablePanel
      defaultSize={100} 
      
      >     
    <Tabs
      defaultValue={currentValue}
     
    >
      <div className="flex items-center w-full justify-between border-b border-gray-700 px-5 py-3">
      <TabsList className="bg-transparent">
        <TabsTrigger value="output" asChild>
          <Button variant="link"  className="text-secondary-foreground  dark:data-[state=active]:bg-[hsl(240,41%,13%)]">Output</Button>
        </TabsTrigger>
        <TabsTrigger value="testCases" asChild >
          <Button variant={"link"} className="text-secondary-foreground dark:data-[state=active]:bg-[hsl(240,41%,13%)]">Test Results</Button>
        </TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2">
      <TooltipProvider>
          <Tooltip>
        <TooltipTrigger asChild>
          <Button
           size="icon"
           variant="ghost"
            className=""
            onClick={handleOutputReset}
          >
            <ListX/>
            <span className="sr-only">Clear Output</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear Output <kbd>Ctrl</kbd> + <kbd>o</kbd> </p>
        </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className=""
            onClick={handleTerminalClose}
          >
            <X/>
            <span className="sr-only">Close Terminal</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Close Terminal <kbd>Ctrl</kbd> + <kbd>i</kbd> </p>
        </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      </div>
      <TabsContent value="testCases" className="pb-4">
        <div className=" py-2  mb-3">
          <p
            className={cn(
              "px-5",
              numberOfPassed && "text-green-400 dark:text-green-700"
            )}
          >
            <span>Passed</span> <span>{numberOfPassed}</span>
          </p>
          <p className={cn("px-5",numberOfFailed && "text-red-400 dark:text-red-700")}>
            {" "}
            <span>Failed</span> <span>{numberOfFailed}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 my-2 px-2">
          <div
            className={cn(
              "h-6 w-2",
             numberOfPassed != sampleTestCases.length
                ? "dark:bg-red-700 bg-red-400"
                : "dark:bg-green-700 bg-green-400"
            )}
          ></div>
          <h3 className="text-xl font-medium">Test Results</h3>
        </div>
        <div className="pl-3.5 ">
          {testCases.map((testCase, index) => (
            <div key={testCase.description + index} className="space-y-1.5">
              <div className="text-[15px] font-medium">
                <button
                  className="flex items-center gap-1 capitalize py-2  px-3 hover:bg-gray-400  rounded-md dark:hover:bg-[hsl(240,41%,13%)] max-w-fit cursor-pointer"
                  onClick={() =>{
                    if(currTestCase === index){
                      setCurrTestCase(-1)
                    }else {
                      setCurrTestCase(index)
                    }
                  }
                  }
                >
                  {" "}
                  {
                  currTestCase !== index ?  <ChevronRight size={18}
                    className={cn(
                      !testCase.passed 
                        ? "dark:text-red-700 text-red-400"
                        : "dark:text-green-700 text-green-400"
                    )}
                  /> : <ChevronDown
                  size={14}
                  className={cn(
                    !testCase.passed 
                      ? "dark:text-red-700 text-red-400"
                      : "dark:text-green-700 text-green-400"
                  )}
                  />
                  }
                  <p>
                  {testCase.description}
                  </p>
                </button>
              </div>
              {currTestCase === index && (!testCase.passed ? (
                <div className="pl-10 text-red-600 text-[15px] ">
                  <p className="flex items-center gap-2">
                    <span>
                      <AlertCircle className="mr-0.5" />
                    </span>
                    <span>

                    expected <code>{testCase.output}</code> to equal{" "}
                    <code> {testCase.expectedOutput}</code>{" "}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-green-600 pl-10 flex items-center gap-2">
                  <span>
                    {" "}
                    <CheckCircle2Icon />
                  </span>{" "}
                  <span>Test Passed</span>
                </p>
              ))}
            </div>
          ))}
          {testCases.length > 1 && numberOfPassed === testCases.length && (
          <div className="h-12 px-5 py-3 border-dotted border dark:border-green-700 border-green-400 flex items-center gap-2 text-green-400 dark:text-green-700">
            <CheckCircle2Icon />
            <p className="font-medium">All Test's Passed!</p>
          </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="output" className="px-5">
        {output.length === 0 ? <div className="h-8 w-0.5 bg-gray-500"></div> : <p className="whitespace-break-spaces">{output}</p>}
      </TabsContent>
    </Tabs>
      </ResizablePanel>
      </div>
    </ResizablePanelGroup>
  );
}
