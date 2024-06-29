import { useNavigate } from "react-router-dom";
import { Check, Info } from "lucide-react";
import { cn } from "@/utils";
import { Progress } from "../ui/progress";
import { TooltipProvider, TooltipContent, TooltipTrigger, Tooltip } from "../ui/tooltip";
import { RootProps,useRoot } from "@/providers/RootProvider";
import { useMutate } from "@/hooks/query/useMutate";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { CourseProgress } from "@/types";
import { AxiosResponse } from "axios";
import { useLearn } from "@/providers/LearnProvider";

type Props = {
  title: string;
  id: string;
  imageSrc: string;
  disabled?: boolean;
  active?: boolean;
  progress?: number;
  completed: boolean;
  handleInfoClick: (id: string) => void;
  setDisable: (value: boolean) => void;
};
type ResponseData = {
  body: {
    courseProgress: CourseProgress
  }
}
export  default function Card ({
  title,
  id,
  imageSrc,
  disabled,
  active,
  progress,
  completed,
  handleInfoClick,
  setDisable
}: Props){
    const navigate = useNavigate();
    const {setData} = useRoot() as RootProps;
    const {state} = useAuth();
    const {setCourseProgress} = useLearn();
    const {mutate, isPending} = useMutate({
      defaultMessage: "failed to enroll in course",
      method: 'post',
      route: `/students/${state.auth?.profileId}/courses/enroll`,
      onSuccess(response: AxiosResponse<any, any>) {
        // get the course progress returned from the server
        const {courseProgress} = (response.data as ResponseData)?.body
        // set the course progress in the learn provider store
        setCourseProgress(courseProgress);
        // redirect to the learn page of the course (we would fetch only the curriculum there in in this case)
        const currentCourse = {
          id,
          title,
          imageSrc
        }
        setData(prev => ({
          ...prev,
          currentCourse
        }))
        localStorage.setItem('current-course', JSON.stringify(currentCourse));
        navigate(`/learn/${id}`);
      },
      onSettled() {
        setDisable(false);
      },
    });
    function handleClick(){
        // store current course in global store.
        // navigate to its learn page
        setData(prev => ({
          ...prev,
          currentCourse: {
            id,
            title,
            imageSrc
          },
        }));
        const currentCourse = {
          id,
          title,
          imageSrc
        }
        // in this case we would have to fetch both curriculum and course progress
        localStorage.setItem('current-course', JSON.stringify(currentCourse));
        navigate(`/learn/${id}`);
    }
    async function handleEnroll(e: React.MouseEvent<HTMLButtonElement>){
      // prevent the click event from bubbling up
      e.stopPropagation();
      mutate({courseId: id})
      setDisable(true)
    }
  return (
    <div
      onClick={active ? handleClick: undefined}
      className={cn(
        "h-full border-2 max-w-[350px] md:max-w-full w-full rounded-xl border-b-4 hover:bg-slate-100 dark:hover:bg-black/70 cursor-pointer hover:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]",
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
            }} className="dark:bg-neutral-800/80 bg-neutral-200 rounded-full p-2 h-7 w-7  hover:opacity-50 flex justify-center items-center">
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
      {progress !== undefined && <Progress className="h-3" value={progress}/> }
      {!active && (<Button onClick={handleEnroll} disabled={disabled} variant={'primary'}>
        {isPending ? 'Enrolling...' : 'Enroll'}
      </Button>)}
    </div>
  );
};