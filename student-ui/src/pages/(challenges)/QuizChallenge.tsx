import Footer from "@/components/challenges/Footer";
import Header from "@/components/challenges/Header";
import { MultipleChoice } from "@/components/quiz/MultipleChoice";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import quizChallenges from "@/data/sample-curriculum/quizchallenge.json";
type QuizChallenges = (
  | {
      quizType: "MultipleChoice";
      answer: string;
      options: string[];
      question: string;
    }
  | { quizType: "CompleteSequence", answer: string }
  | { quizType: "MatchingPairs", answer: string }
)[];
export default function QuizChallenge() {
  const [status, setStatus] = React.useState<"correct" | "wrong" | null>(null);
  const [currChallenge, setCurrChallenge] = React.useState(-1); // index of current challenge.
  const [userSelection, setUserSelection] = React.useState<string>("");
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const [challenges, setChallenges] = React.useState<QuizChallenges>([]);
  const failCount = React.useRef(0);
  const { levelId, courseId } = useParams();
  React.useEffect(() => {
    if (challenges.length === 0) {
        const normalizedQuiz = quizChallenges.filter((item) => item.quizType === 'MultipleChoice' || item.quizType === 'CompleteSequence' || item.quizType === 'MatchingPairs')
        setChallenges(normalizedQuiz as QuizChallenges);
        setCurrChallenge(0);
    }
  }, []);
  const navigate = useNavigate();
  // we need to track our current quiz challenge
  // what is it status
  // if the user fails the question twice advise them to use a hint or review the previous lesson.
  // use a pop up for this
  function handleSelect(option: string) {
    if (status !== null) {
      setStatus(null);
    }
    if (option === userSelection) {
      setUserSelection("");
      return;
    }
    setUserSelection(option);
  }
  function checkSelection() {
    if (userSelection === challenges[currChallenge].answer) {
      setStatus("correct");
      // move to next challenge
      // if we are done move to result page
      // reset failCount
      failCount.current = 0;
      if (currChallenge === challenges.length - 1) {
        setIsCompleted(true);
      }
    } else {
      setStatus("wrong");
      failCount.current += 1;
    }
  }
  function getComp() {
    if (currChallenge < 0 || currChallenge >= challenges.length) return null;
    const challenge = challenges[currChallenge];
    console.log("status in getComp", status);
    if (challenge.quizType === "MultipleChoice") {
      return (
        <MultipleChoice
          options={challenge.options}
          handleSelect={handleSelect}
          question={challenge.question}
          status={status}
          selectedOption={userSelection}
        />
      );
    }
    return null;
  }
  function handleSubmit() {
    console.log("finish quiz, show result page, proceed to a new level.");
    navigate(`/challenge/${courseId}/level/${levelId}/result?type=quiz`);
  }
  function changePage() {
    setStatus(null);
    setCurrChallenge((prev) => prev + 1);
  }
  console.log(challenges)
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
        disabled={false}
        isCompleted={isCompleted}
        onSubmit={handleSubmit}
        status={status}
        changePage={changePage}
      />
    </div>
  );
}
