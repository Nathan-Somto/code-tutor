import { useNavigate } from "react-router-dom";
import { Check, Info } from "lucide-react";
import { cn } from "@/utils";
import { Progress } from "../ui/progress";
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "../ui/tooltip";

type Props = {
  title: string;
  id: string;
  imageSrc: string;
  disabled?: boolean;
  active?: boolean;
  progress?: number;
  completed: boolean;
  handleInfoClick: (id: string) => void;
};

export  default function Card ({
  title,
  id,
  imageSrc,
  disabled,
  active,
  progress,
  completed,
  handleInfoClick
}: Props){
    const navigate = useNavigate();
    function handleClick(){
        // store current course in global store.
        // navigate to its learn page
        navigate(`/learn/${id}`)
    }
  return (
    <div
      onClick={handleClick}
      className={cn(
        "h-full border-2 max-w-[350px] md:max-w-full w-full rounded-xl border-b-4 hover:bg-black/70 cursor-pointer hover:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]",
        disabled && "pointer-events-none opacity-50",
        completed && "border-[3px] border-primary"
      )}
    >
      <div className="min-h-[24px] w-full flex items-center justify-between">
        <TooltipProvider>
          <Tooltip>
          <TooltipTrigger onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleInfoClick(id)
            }} className="bg-neutral-800/80 rounded-full p-2 h-7 w-7  hover:opacity-50 flex justify-center items-center">
          <Info size={18} className="flex-shrink-0"/>
          </TooltipTrigger>
          <TooltipContent>
            <p>more info on {title}</p>
          </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {completed && (
          <div className="rounded-md  self-end bg-primary flex items-center justify-center p-1.5">
            <Check className="text-white stroke-[4] h-4 w-4" />
          </div>
        )}
      </div>
      <img
        src={imageSrc}
        alt={title}
        className="rounded-lg h-20 w-24 drop-shadow-md border object-cover"
      />
      <p className="text-neutral-700 dark:text-neutral-400 text-center font-bold mt-3 mb-4">
        {title}
      </p>
      {progress && <Progress className="h-3" value={progress}/> }
    </div>
  );
};