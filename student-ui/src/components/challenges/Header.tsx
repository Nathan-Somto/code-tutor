import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import React from "react";
import GreenMonster from "@/assets/green-monster.jpeg"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "../ui/dialog";
import { useNavigate, useParams } from "react-router-dom";
import HintsButton from "../hintsButton";
type Props = {
  progress: number;
  hintsLeft: number;
  hintsRefreshDate: Date;
  topicName: string;
  isLesson: boolean;
  openHintBox?: () => void;
};
export default function Header({
  progress,
  hintsLeft=-1,
  hintsRefreshDate,
  topicName,
  isLesson,
  openHintBox
}: Props) {
  const {courseId} = useParams();
  const [openModal, setOpenModal] = React.useState(false);
  const navigate = useNavigate()
  async function handleSessionEnd(){
    // store the user's current progress (get this from the store)
    // redirect to the learn page
    navigate(`/learn/${courseId}`)
    // close the modal
    setOpenModal(false);
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
        <DialogDescription className="font-medium text-lg text-center">Are you sure you quit to the {isLesson ? "lesson" : "quiz"}?</DialogDescription>
        <DialogFooter className="flex !flex-col space-y-3.5 !space-x-0 mt-4">
          <Button variant="danger" className="max-w-full" onClick={handleSessionEnd}>End Session</Button>
          <Button variant="primary" className="max-w-full" onClick={() => setOpenModal(false)}>Continue Lesson</Button>
        </DialogFooter>
       </DialogContent>
      </Dialog>
      <p className="text-muted-foreground/80 text-sm text-ellipsis">{topicName}</p>
      </div>
      <div className="w-[70%] flex-shrink-0">
        <Progress value={progress} className="w-full h-3" />
      </div>
        <HintsButton
        hintsLeft={hintsLeft}
        hintsRefreshDate={hintsRefreshDate}
        handleClick={openHintBox}
        />
    </header>
   
    </>
  );
}
