import Footer from "@/components/challenges/Footer";
import Header from "@/components/challenges/Header";
import ReactMarkdown from "@/components/ReactMarkdown";
import { Spinner } from "@/components/ui/spinner";
import LessonData from "@/data/sample-curriculum/lessons.json";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Lesson() {
  const {levelId, courseId} = useParams();
  const navigate = useNavigate()
  const [data, setData] = React.useState<{
    content: string[],
    topicName: string
  } | null>(null);
  const [currentPage, setCurrentPage] = React.useState(-1)
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
    navigate(`/challenge/${courseId}/level/${levelId}/result?type=lesson`)
  }

  React.useEffect(() => {
    //@Todo: perform backend search
    //@Todo: confirm user has unlocked lesson or level
    const lesson= LessonData.find(lesson => lesson.levelId === levelId);
    if(typeof lesson === 'undefined'){
      navigate(-1)
    }
    else{
      setCurrentPage(0);
      setData({
        topicName: lesson.topicName,
        content: lesson.content
      })
    }
  }, [])
  if(data === null){
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
        hintsLeft={3}
        topicName={data.topicName}
        hintsRefreshDate={new Date(new Date().getTime() +  60 * 1000)}
        isLesson
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
