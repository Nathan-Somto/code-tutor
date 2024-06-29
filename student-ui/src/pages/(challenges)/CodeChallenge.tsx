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
// import { TerminalProps } from "@/components/IDE/types";
import { Spinner } from "@/components/ui/spinner";
// import challengeData from "@/data/sample-curriculum/codechallenge.json";
import { useNavigate } from "react-router-dom";
import ExitBtn from "@/components/challenges/ExitBtn";
import { codeApi, mainApi } from "@/config/axios";
import { useChallenge } from "@/providers/ChallengesProvider";
import { useRoot } from "@/providers/RootProvider";
import { CodeChallengeType, CodeSolutionType, CompleteLevelType, ResponseData } from "@/types";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { TestCase, TestResults } from "@/types";
import { useAuth } from "@/providers/AuthProvider";
import { displayError } from "@/utils/displayError";
import { useToast } from "@/components/ui/use-toast";
import { ErrorMessage } from "@/components/error-message";

function CodeChallenge() {
  // when should i store the user's solution?
  // test the user's code
  // check if the user passed
  // show submit button if they passed (show run tests otherwise)
  // when they submit, store
  const [openModal, setOpenModal] = React.useState(false);
  const { levelId, courseId } = useParams();
  const [testCases, setTestCases] = React.useState<TestCase[]>(
    []
  );
  const [testResults, setTestResults] = React.useState<TestResults>([])
  const [output, setOutput] = React.useState("");
  const [codeContent, setCodeContent] = React.useState("");
  const [processingCode, setProcessingCode] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [markdownData, setMarkdownData] = React.useState<string>("");
  const [maximize, setMaximize] = React.useState<boolean>(false);
  const [functionCall, setFunctionCall] = React.useState<string  |  undefined | null>(null)
  const baseCode = React.useRef<string>("");
  const Langauge = "Python";
  const {toast} = useToast();
  const {data: {currentCourse}} = useRoot();
  const {isSubmitting, isEndingSession, completeLevel, isFetchingProgress} = useChallenge();
  const navigate = useNavigate();
  const {state: {auth}} = useAuth();
  const {data: response, isError, isPending: fetchingCodeChallenge, refetch} = useGetQuery<ResponseData<{level:{code: CodeChallengeType}}>>({
    enabled: currentCourse !== null && levelId !== undefined && !isFetchingProgress,
    queryKey: ['courses', currentCourse?.id, 'levels', levelId, 'quiz'],
    route: `/courses/${currentCourse?.id}/levels/${levelId}?levelType=Code`,
    defaultMessage: "failed to get quiz"
  });
  console.log(response)
  function handleChange(value: string | undefined, _event: unknown) {
    setCodeContent(value ?? "");
  }
  async function handleRun() {
    setProcessingCode(true);
    try {
      const response = await codeApi.post(`/run-code`, {
        language: "py",
        code: codeContent,
        input: "",
      });
      //console.log(response.data.body.output);
      setOutput(response.data.body.output);
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
      if(typeof courseId === 'undefined' || typeof levelId === 'undefined'){
        displayError(toast, new Error('course id or level id must be defined!'),'unexpected error')
        return;
      }
      console.log({
        code: codeContent,
        language: "py",
        tests: testCases,
        functionCall
      })
      // send code to test code endpoint
      const testResponse = await codeApi.post('/test-code', {
        code: codeContent,
        language: "py",
        tests: testCases,
        functionCall
      })
      console.log(testResponse.data);
      // check if every test case passed!
      if(testResponse.data.body && Array.isArray(testResponse.data.body)){
        if(testResponse.data.body.every((item: any) => item.passed)){
          // save user's code
          const savedCode: CodeSolutionType = {
            answer: codeContent,
            codeChallengeId: response?.data?.body?. level?.code?.id ?? '',
            courseId,
            levelId
          }
        const savedData = await mainApi.post(`/students/${auth?.profileId}/save-solution`, savedCode );
        console.log(savedData)
          // complete level
          completeLevel<CompleteLevelType>({courseId, levelId});
          navigate(`/challenge/${courseId}/level/${levelId}/result?type=code`);
          return;
        }
        else {
          setTestResults(testResponse.data.body as TestResults)
        }
      }
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
    
    const challenge = response?.data?.body?.level?.code;
    console.log(challenge);
    if(challenge !== undefined) {
        baseCode.current = challenge.starterCode;
        setCodeContent(challenge.starterCode);
        setMarkdownData(challenge.starterFile);
        setTestCases(challenge.testCases);
        setFunctionCall(challenge.functionName)
    }
    // fetchData();
    return () => {
      baseCode.current = "";
    };
  }, [response, response?.data?.body?.level?.code]);
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
    if(isError){
      return (
        <ErrorMessage refetch={refetch}/>
      )
    }

  if(fetchingCodeChallenge || isSubmitting || isEndingSession){
    return(
      <Spinner 
        color="green"
        size="xs"
        variant="dots"
        withContainer
        containerBackground="transparent"
        containerType="full"
      />
    )
  }
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={20}
        className=" z-[99999] border-r relative bg-background border-gray-400  h-screen overflow-y-auto flex-shrink-0 min-h-screen py-5 px-4"
      >
        <div>
          {fetchingCodeChallenge || !markdownData ? (
            <Spinner
              variant="round"
              withContainer
              containerBackground="transparent"
              containerType="center"
              color="foreground"
            />
          ) : (
            <div>
              <ReactMarkdown markdown={markdownData} />
            </div>
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
            <ExitBtn handleSessionEnd={() => navigate(`/learn/${currentCourse?.id}`)} openModal={openModal} setOpenModal={setOpenModal} levelType="code challenge"/>
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
                      className="dark:text-white"
                      onClick={handleRun}
                      variant="secondary"
                      disabled={processingCode || submitting}
                    >
                      {processingCode ? (
                        <Spinner size="md"  color="slate" />
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
                      className="dark:text-white/90"
                      disabled={processingCode || submitting}
                      onClick={handleSubmitCick}
                      variant={'primary'}
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
              currentValue: `${testResults.length ? "testCases" : "output"}`,
              testCases: testResults,
            }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeChallenge;
