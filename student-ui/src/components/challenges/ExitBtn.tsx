import GreenMonster from "@/assets/green-monster.jpeg"
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "../ui/dialog";
import React from "react";
type Props = {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    handleSessionEnd: () => void;
    levelType: "lesson" | "quiz" | "code challenge";

}
export default function ExitBtn({openModal, setOpenModal, handleSessionEnd, levelType}: Props) {
    return (
    <Dialog open={openModal} onOpenChange={prev => setOpenModal(prev)}>
      <DialogTrigger asChild>
      <Button variant={"danger"} size="icon" className="h-8 w-8">
        <X size="20" />
      </Button>
       </DialogTrigger>
       <DialogContent className="z-[1099999999999999999999999999999999999999999999999999]">
        <img src={GreenMonster} alt="sad green monster face" className="h-32 w-32 mx-auto object-contain"/>
        <DialogDescription className="font-medium text-lg text-center">Are you sure you quit to the {levelType}?</DialogDescription>
        <DialogFooter className="flex !flex-col space-y-3.5 !space-x-0 mt-4">
          <Button variant="danger" className="max-w-full" onClick={handleSessionEnd}>End Session</Button>
          <Button variant="primary" className="max-w-full" onClick={() => setOpenModal(false)}>Continue Lesson</Button>
        </DialogFooter>
       </DialogContent>
      </Dialog>
    )
}