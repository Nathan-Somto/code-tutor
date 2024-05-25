import Footer from "@/components/challenges/Footer";
import Header from "@/components/challenges/Header";
import { MultipleChoice } from "@/components/quiz/MultipleChoice";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import quizChallenges from "@/data/sample-curriculum/quizchallenge.json";
import { CompleteSequence } from "@/components/quiz/CompleteSequence";
import { extractBlocks } from "@/utils/extractBlocks";
import { getDynamicVars } from "@/utils/getDynamicVars";
import { extractAndShufflePairs } from "@/utils/extractAndShufflePairs";
import MatchingPairs from "@/components/quiz/MatchingPairs";
import { extractKeysAndValues } from "@/utils/extractKeysAndValue";
type QuizChallenges = (
  | {
      quizType: "MultipleChoice";
      answer: string;
      options: string[];
      question: string;
    }
  | {
      quizType: "CompleteSequence";
      answer: string;
      options: string[];
      question: string;
      language: string;
    }
  | { quizType: "MatchingPairs"; answer: string }
)[];
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
  const [challenges, setChallenges] = React.useState<QuizChallenges>([]);
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
  const failCount = React.useRef(0);
  const { levelId, courseId } = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (challenges.length === 0) {
      const quizzes = quizChallenges.filter(
        (item) =>
          item.quizType === "MultipleChoice" ||
          item.quizType === "CompleteSequence" ||
          item.quizType === "MatchingPairs"
      ) as QuizChallenges;
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
    (quizzes: QuizChallenges, index: number) => {
      if (index < 0 || index > quizzes.length) {
        return;
      }
      if (
        quizzes.length > 0 &&
        quizzes[index].quizType === "CompleteSequence"
      ) {
        const availableVars = getDynamicVars(quizzes[index].question);
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
    (quizzes: QuizChallenges, index: number) => {
      if (index < 0 || index > quizzes.length) {
        return;
      }
      if (quizzes.length > 0 && quizzes[index].quizType === "MatchingPairs") {
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
    if (challenge.quizType === "CompleteSequence") {
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
    if (quiz.quizType !== "CompleteSequence") return "";
    let userAnswer = quiz.question;
    for (const key in seqState.values) {
      if (quiz.quizType === "CompleteSequence") {
        userAnswer = userAnswer.replace(
          new RegExp(`\\$\\{${key}\\}`, "g"),
          seqState.values[key]
        );
      }
    }
    return userAnswer;
  }
  const disableFooter = React.useMemo(() => {
    if (challenges.length === 0) return false;
    return challenges[currChallenge].quizType === "MatchingPairs"
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
    if (currentQuiz.quizType === "CompleteSequence") {
      const { code } = extractBlocks(replaceDynamicVars());
      userAnswer = code.trim();
    }
    if (currentQuiz.quizType === "MatchingPairs") {
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
      failCount.current = 0;
      if (currChallenge === challenges.length - 1) {
        localStorage.removeItem(`challenge/${courseId}/level/${levelId}/quiz`);
        setIsCompleted(true);
      }
    } else {
      setStatus("wrong");
      failCount.current += 1;
    }
  }
  function handlePairStatus(key: string, value: string) {
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
    if (challenge.quizType === "MultipleChoice") {
      return (
        <MultipleChoice
          options={challenge.options}
          handleSelect={handleChoiceSelect}
          question={challenge.question}
          status={status}
          selectedOption={userSelection}
        />
      );
    }
    if (challenge.quizType === "CompleteSequence") {
      const { question, code } = extractBlocks(challenge.question);
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
    if (challenge.quizType === "MatchingPairs") {
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
    navigate(`/challenge/${courseId}/level/${levelId}/result?type=quiz`);
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
  return (
    <div>
      <Header
        progress={((currChallenge + 1) / challenges.length) * 100}
        hintsLeft={3}
        topicName={"Introduction to python"}
        hintsRefreshDate={new Date(new Date().getTime() + 60 * 1000)}
        isLesson
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
        sequenceOptions={
          challenges[currChallenge]?.quizType === "CompleteSequence"
            ? seqState.options ?? undefined
            : undefined
        }
        handleSequenceClick={
          challenges[currChallenge]?.quizType === "CompleteSequence"
            ? handleSequenceFooterSelect
            : undefined
        }
      />
    </div>
  );
}
