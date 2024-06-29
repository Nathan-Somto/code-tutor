import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import React from "react";
import GreenMonster from "@/assets/green-monster.jpeg"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "../ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import HeartsButton from "../heartsButton";
import { useChallenge } from "@/providers/ChallengesProvider";
type Props = {
  progress: number;
  topicName: string;
  heartsLeft: number;
  type: 'quiz'
  currentPage: number;
} | {
  type : 'lesson',
  progress: number;
  topicName: string;
  currentPage: number;
};
export default function Header({
  progress,
  topicName,
  currentPage,
  ...props
}: Props) {
  // const {courseId} = useParams();
  const [openModal, setOpenModal] = React.useState(false);
  const {levelCompleted, handleEndSession, isEndingSession} = useChallenge();
  // new Date(new Date().getTime() + 60 * 1000)
  const progressData = {
    currentQuizNumber: props.type === 'quiz' ? currentPage : undefined,
    currentLessonNumber: props.type === 'lesson' ? currentPage : undefined
  }
  return (
    <>
    <header className="flex items-center bg-background inset-x-0 justify-between fixed top-0 max-w-5xl w-full mx-auto h-16 px-4 py-5">
      <div className="flex items-center gap-x-2.5">   
      <Dialog open={openModal} onOpenChange={prev => setOpenModal(prev)}>
      <DialogTrigger asChild>
      <Button variant={"danger"} size="icon" className="h-8 w-8">
        <X size="20" />
      </Button>
       </DialogTrigger>
       <DialogContent>
        <img src={GreenMonster} alt="sad green monster face" className="h-32 w-32 mx-auto object-contain"/>
        <DialogDescription className="font-medium text-lg text-center">Are you sure you quit to the {props.type}?</DialogDescription>
        <DialogFooter className="flex !flex-col space-y-3.5 !space-x-0 mt-4">
          <Button variant="danger" disabled={isEndingSession} className="max-w-full" onClick={!levelCompleted ? () => handleEndSession(progressData): undefined}>{!isEndingSession ? "End Session": "Loading..."}</Button>
          <Button variant="primary" className="max-w-full" onClick={() => setOpenModal(false)}>Continue Lesson</Button>
        </DialogFooter>
       </DialogContent>
      </Dialog>
      <p className="text-muted-foreground/80 text-sm text-ellipsis">{topicName}</p>
      </div>
      <div className="w-[70%] flex-shrink-0">
        <Progress value={progress} className="w-full h-3" />
      </div>
      {
        props.type === 'quiz' && (
          <HeartsButton
          heartsLeft={props.heartsLeft }
          heartsRefreshDate={new Date()}
          />
        ) 
      }
       
    </header>
   
    </>
  );
}
