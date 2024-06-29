import Footer from "@/components/challenges/Footer";
import Header from "@/components/challenges/Header";
import { MultipleChoice } from "@/components/quiz/MultipleChoice";
import { useParams } from "react-router-dom";
import React from "react";
// import quizChallenges from "@/data/sample-curriculum/quizchallenge.json";
import { CompleteSequence } from "@/components/quiz/CompleteSequence";
import { extractBlocks } from "@/utils/extractBlocks";
import { getDynamicVars } from "@/utils/getDynamicVars";
import { extractAndShufflePairs } from "@/utils/extractAndShufflePairs";
import MatchingPairs from "@/components/quiz/MatchingPairs";
import { extractKeysAndValues } from "@/utils/extractKeysAndValue";
import { MAX_HEARTS_COUNT } from "@/constants";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useRoot } from "@/providers/RootProvider";
import { useChallenge } from "@/providers/ChallengesProvider";
import { ResponseData, QuizChallengeType, CompleteLevelType } from "@/types";
import { displayError } from "@/utils/displayError";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ErrorMessage } from "@/components/error-message";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import  Heart from "@/assets/heart.svg";
import { Button } from "@/components/ui/button";
export type Status = "correct" | "wrong" | null;
type PairState = {
  answerMap: { [x: string]: string };
  selectedPairs: { [x: string]: Status };
  keys: string[];
  values: string[];
};
type SeqState = {
  values: {
    [x: number]: string;
  };
  options: string[];
  availableVars: number[];
};

export default function QuizChallenge() {
  const [status, setStatus] = React.useState<Status>(null);
  const [currChallenge, setCurrChallenge] = React.useState(-1); // index of current challenge.
  const [userSelection, setUserSelection] = React.useState<string>("");
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const [challenges, setChallenges] = React.useState<QuizChallengeType[]>([]);
  const [seqState, setSeqState] = React.useState<SeqState>({
    values: {},
    options: [],
    availableVars: [],
  });
  const [pairState, setPairState] = React.useState<PairState>({
    answerMap: {},
    selectedPairs: {},
    keys: [],
    values: [],
  });
  const [failCount, setFailCount] = React.useState(0);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const { levelId, courseId } = useParams();
  //const navigate = useNavigate();
  const {data:{currentCourse}} = useRoot();
  const {completeLevel, isFetchingProgress, isSubmitting, handleEndSession, levelCompleted} = useChallenge();
  const {data: response, isError, isPending, refetch} = useGetQuery<ResponseData<{quiz: QuizChallengeType[]}>>({
    enabled: currentCourse !== null && levelId !== undefined && !isFetchingProgress,
    queryKey: ['courses', currentCourse?.id, 'levels', levelId, 'quiz'],
    route: `/courses/${currentCourse?.id}/levels/${levelId}?levelType=Quiz`,
    defaultMessage: "failed to get quiz"
  });
  const {toast} = useToast()
  React.useEffect(() => {
    const quiz = response?.data?.body?.quiz;
    if (quiz !== undefined) {
      const quizzes = quiz.filter(
        (item) =>
          item.quizType === "MULTIPLE_CHOICE" ||
          item.quizType === "COMPLETE_SEQUENCE" ||
          item.quizType === "MATCHING_PAIRS"
      );
      setChallenges(quizzes);
      let challengeNumber: string | null | number = localStorage.getItem(
        `challenge/${courseId}/level/${levelId}/quiz`
      );
      challengeNumber = challengeNumber === null ? 0 : +challengeNumber;
      handleSeqState(quizzes, challengeNumber);
      handlePairState(quizzes, challengeNumber);
      setCurrChallenge(challengeNumber);
    }
  }, []);
  React.useEffect(() => {
    // first execute after the first page change.
    if (currChallenge > 0) {
      handleSeqState(challenges, currChallenge);
      handlePairState(challenges, currChallenge);
    }
  }, [currChallenge]);
  const handleSeqState = React.useCallback(
    (quizzes: QuizChallengeType[], index: number) => {
      if (index < 0 || index > quizzes.length) {
        return;
      }
      if (
        quizzes.length > 0 &&
        quizzes[index].quizType === "COMPLETE_SEQUENCE"
      ) {
        const availableVars = getDynamicVars(quizzes[index].question ?? '');
        setSeqState({
          options: quizzes[index].options,
          availableVars,
          values: {},
        });
      }
    },
    []
  );
  const handlePairState = React.useCallback(
    (quizzes: QuizChallengeType[], index: number) => {
      if (index < 0 || index > quizzes.length) {
        return;
      }
      if (quizzes.length > 0 && quizzes[index].quizType === "MATCHING_PAIRS") {
        const { pair1: keys, pair2: values } = extractAndShufflePairs(
          quizzes[index].answer
        );
        setPairState({
          answerMap: extractKeysAndValues(quizzes[index].answer),
          selectedPairs: {},
          keys,
          values,
        });
      }
    },
    []
  );
  function openHeartsModal() {
    setOpenModal(true);
  }
  function handleChoiceSelect(option: string) {
    if (status !== null) {
      setStatus(null);
    }
    if (option === userSelection) {
      setUserSelection("");
      return;
    }
    setUserSelection(option);
  }
  function handleSequenceBlockSelect(value: number) {
    if (seqState.values[value] !== undefined) {
      // remove from values obj.
      const valuesObj = { ...seqState.values };
      delete valuesObj[value];
      // add the option to the options array
      const options = [...seqState.options, seqState.values[value]];
      // add value back to availableVars.
      const availableVars = [value, ...seqState.availableVars];
      setSeqState({
        values: valuesObj,
        options,
        availableVars,
      });
    }
  }
  function handleSequenceFooterSelect(option: string) {
    // remove the option's text from footer if it has not been selected.
    const challenge = challenges[currChallenge];
    if (challenge.quizType === "COMPLETE_SEQUENCE") {
      if (seqState.availableVars.length > 1) {
        // remove the available var from the list of available vars.
        const [value, ...availableVars] = seqState.availableVars;
        // remove the option from what is being passed to the footer.
        const newOptions = seqState.options.filter((op) => op !== option);
        setSeqState((prev) => ({
          ...prev,
          options: newOptions,
          values: { ...prev.values, [value]: option },
          availableVars,
        }));
      } else {
        const availableVar = seqState.availableVars[0];
        const lastOption = seqState.values[availableVar];
        const newOptions =
          lastOption === undefined
            ? seqState.options.filter((op) => op !== option)
            : [...seqState.options.filter((op) => op !== option), lastOption];
        setSeqState((prev) => ({
          ...prev,
          values: { ...prev.values, [availableVar]: option },
          options: newOptions,
        }));
      }
    }
  }
  function replaceDynamicVars() {
    const quiz = challenges[currChallenge];
    if (quiz.quizType !== "COMPLETE_SEQUENCE") return "";
    let userAnswer: string = quiz.question ?? '';
    for (const key in seqState.values) {
      if (quiz.quizType === "COMPLETE_SEQUENCE") {
        userAnswer = userAnswer?.replace(
          new RegExp(`\\$\\{${key}\\}`, "g"),
          seqState.values[key]
         ) ?? '';
      }
    }
    return userAnswer;
  }
  const disableFooter = React.useMemo(() => {
    if (challenges.length === 0) return false;
    return challenges[currChallenge].quizType === "MATCHING_PAIRS"
      ? Object.values(pairState.answerMap).length !==
          Object.values(pairState.selectedPairs).length / 2
      : false;
  }, [currChallenge, pairState, challenges]);
  function checkCorrectPairing() {
    return Object.values(pairState.selectedPairs).every(
      (item) => item === "correct"
    );
  }
  function checkSelection() {
    const currentQuiz = challenges[currChallenge];
    let userAnswer: string | undefined;
    let isCorrectPairing: boolean = false;
    if (currentQuiz.quizType === "COMPLETE_SEQUENCE") {
      const { code } = extractBlocks(replaceDynamicVars());
      userAnswer = code.trim();
    }
    if (currentQuiz.quizType === "MATCHING_PAIRS") {
      isCorrectPairing = checkCorrectPairing();
    }
    // if complete sequence replace the dynamic vars in the question with userSelection
    if (
      userSelection === currentQuiz.answer ||
      userAnswer === currentQuiz.answer ||
      isCorrectPairing
    ) {
      setStatus("correct");
      // move to next challenge
      // if we are done move to result page
      // reset failCount
      setFailCount(0);
      if (currChallenge === challenges.length - 1) {
        localStorage.removeItem(`challenge/${courseId}/level/${levelId}/quiz`);
        setIsCompleted(true);
      }
    } else {
      setStatus("wrong");
      setFailCount(prev => prev + 1);
    }
  }
  function handlePairStatus(key: string, value: string) {
    if(failCount === MAX_HEARTS_COUNT){
      openHeartsModal();
    }
    const status: Status =
      pairState.answerMap[key] === value ? "correct" : "wrong";
    setPairState((prev) => ({
      answerMap: {
        ...prev.answerMap,
      },
      selectedPairs: {
        ...prev.selectedPairs,
        [key]: status,
        [value]: status,
      },
      keys: [...prev.keys],
      values: [...prev.values],
    }));
  }
  const getComp = React.useCallback(() => {
    if (currChallenge < 0 || currChallenge >= challenges.length) return null;
    const challenge = challenges[currChallenge];
    if (challenge.quizType === "MULTIPLE_CHOICE") {
      return (
        <MultipleChoice
          options={challenge.options}
          handleSelect={handleChoiceSelect}
          question={challenge.question ?? ''}
          status={status}
          selectedOption={userSelection}
        />
      );
    }
    if (challenge.quizType === "COMPLETE_SEQUENCE") {
      const { question, code } = extractBlocks(challenge.question ?? '');
      return (
        <CompleteSequence
          code={code}
          question={question}
          status={status}
          values={seqState.values}
          handleBlockSelect={handleSequenceBlockSelect}
        />
      );
    }
    if (challenge.quizType === "MATCHING_PAIRS") {
      return (
        <MatchingPairs
          pair1={pairState.keys}
          pair2={pairState.values}
          handlePairStatus={handlePairStatus}
          selectedPairs={pairState.selectedPairs}
        />
      );
    }
    return (
      <div>
        <p>No Quiz Available</p>
      </div>
    );
  }, [challenges, seqState, status, userSelection, pairState]);
  function handleSubmit() {
    console.log("finish quiz, show result page, proceed to a new level.");
    if (typeof courseId === "undefined" || typeof levelId === "undefined") {
      return;
    }
    displayError(toast, new Error('course id or level id must be defined!'),'unexpected error');
    completeLevel<CompleteLevelType>({courseId, levelId});
    //navigate(`/challenge/${courseId}/level/${levelId}/result?type=quiz`);
  }
  function changePage() {
    setStatus(null);
    //@Todo: hash the url for safety
    localStorage.setItem(
      `challenge/${courseId}/level/${levelId}/quiz`,
      (currChallenge + 1).toString()
    );
    setCurrChallenge((prev) => prev + 1);
  }
  if(isError){
    return (
      <ErrorMessage refetch={refetch}/>
    )
  }
  if(isPending || isSubmitting){
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
    <div>
      <Header
        progress={((currChallenge + 1) / challenges.length) * 100}
        heartsLeft={MAX_HEARTS_COUNT - failCount}
        topicName={"Introduction to python"}
        type="quiz"
        currentPage={currChallenge}
      />
      <div className="my-[90px] px-8 max-w-5xl mx-auto">{getComp()}</div>
      <Footer
        type="quiz"
        onCheck={checkSelection}
        disabled={disableFooter}
        isCompleted={isCompleted}
        onSubmit={handleSubmit}
        status={status}
        changePage={changePage}
        outOfHearts={failCount === MAX_HEARTS_COUNT}
        openHeartsModal={openHeartsModal}
        sequenceOptions={
          challenges[currChallenge]?.quizType === "COMPLETE_SEQUENCE"
            ? seqState.options ?? undefined
            : undefined
        }
        handleSequenceClick={
          challenges[currChallenge]?.quizType === "COMPLETE_SEQUENCE"
            ? handleSequenceFooterSelect
            : undefined
        }
      />
      <Dialog open={openModal} onOpenChange={prev => setOpenModal(prev)}>
        <DialogContent>
          <div>
            <img src={Heart} alt="hearts" className="h-32 w-32 grayscale-[50%] object-cover mx-auto mb-2" />
        <DialogHeader className="text-2xl font-medium">Out of Hearts</DialogHeader>   
          </div>
          <p className="opacity-80 mt-2">
            You are out of hearts, please wait for 5 minutes, for the timer to reset.
          </p>
          <DialogFooter className="flex !flex-col space-y-3.5 !space-x-0 mt-4">
          <Button variant="danger" className="max-w-full" onClick={levelCompleted ? () =>  handleEndSession({currentQuizNumber: currChallenge }) : undefined}>End Session</Button>
          <Button variant="primary" className="max-w-full" onClick={() => setOpenModal(false)}>Continue Lesson</Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
