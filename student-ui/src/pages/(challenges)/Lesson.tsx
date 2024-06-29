import Footer from "@/components/challenges/Footer";
import Header from "@/components/challenges/Header";
import { ErrorMessage } from "@/components/error-message";
import ReactMarkdown from "@/components/ReactMarkdown";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
// structure of how the data looks.
// import LessonData from "@/data/sample-curriculum/lessons.json";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useChallenge } from "@/providers/ChallengesProvider";
import { useRoot } from "@/providers/RootProvider";
import { CompleteLevelType, LevelDataType, ResponseData } from "@/types";
import { displayError } from "@/utils/displayError";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
type LessonData = {
  content: string[];
  levelName: string
}
export default function Lesson() {
  const {levelId, courseId} = useParams();
  const navigate = useNavigate()
  const [data, setData] = React.useState<LessonData>({
    content: [],
    levelName: ''
  });
  const {completeLevel, isFetchingProgress, isSubmitting} = useChallenge()
  const {data:{currentCourse}} = useRoot();
  const [currentPage, setCurrentPage] = React.useState(-1);
  // for fetching the content for this level
  const {data: response, isError, isPending, refetch} = useGetQuery<ResponseData<{level: LevelDataType}>>({
    enabled: currentCourse !== null && levelId !== undefined && !isFetchingProgress,
    queryKey: ['courses', currentCourse?.id, 'levels', levelId, 'lesson'],
    route: `/courses/${currentCourse?.id}/levels/${levelId}?levelType=Lesson`,
    defaultMessage: "failed to get lesson"
  });
   const {toast} = useToast();
  // const {state:{auth}} = useAuth();

  function changePage(direction: "left" | "right") {
    console.log("changed Page");
    if(direction === 'left'){
      setCurrentPage((prev) => prev + 1);
    }
    if(direction === 'right' && currentPage !== 0){
      setCurrentPage(prev => prev - 1)
    }
  }
  function onSubmit() {
    console.log("finish lesson, show result page, proceed to a new level.");
    if(typeof courseId === 'undefined' || typeof levelId === 'undefined'){
      displayError(toast, new Error('course id or level id must be defined!'),'unexpected error')
      return;
    }
    completeLevel<CompleteLevelType>({courseId, levelId})
  }

  React.useEffect(() => {
    //@Todo: perform backend search
    //@Todo: confirm user has unlocked lesson or level
    const level = response?.data.body.level;
    if(typeof level !== 'undefined' && typeof level?.lesson === 'undefined'){
      navigate(-1);
    }
    if(typeof level !== 'undefined' && typeof level?.lesson !== 'undefined'){
      setCurrentPage(0);
      setData({
       content: level.lesson.content,
       levelName: level.name
      })
    }
  }, [response]);
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
        progress={((currentPage + 1) / data.content.length) * 100}
        topicName={data.levelName}
        type="lesson"
        currentPage={currentPage}
      />
      <div className="my-20 mx-auto max-w-5xl px-8">
        <ReactMarkdown
          markdown={data.content[currentPage]}
        />
      </div>
      <Footer
        type="lesson"
        changePage={changePage}
        isCompleted={currentPage === data.content.length - 1}
        disabled={false}
        onSubmit={onSubmit}
        isFirstPage={currentPage === 0}
      />
    </div>
  );
}
