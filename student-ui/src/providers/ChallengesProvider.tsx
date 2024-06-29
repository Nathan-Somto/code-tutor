import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoot } from '@/providers/RootProvider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ResultData, ResponseData, LevelProgressType, LevelType } from '@/types';
import { useGetQuery } from '@/hooks/query/useGetQuery';
import { useAuth } from './AuthProvider';
import { useMutate } from '@/hooks/query/useMutate';

import { ErrorMessage } from '@/components/error-message';
import { useQueryClient } from '@tanstack/react-query';



type ChallengeProviderProps = {
  children: ReactNode;
};

type ChallengeContextType = {
  resultData: ResultData | null;
  levelCompleted: boolean;
  handleEndSession (data: {
    currentQuizNumber?: number;
    currentLessonNumber?: number;
}): void;
isFetchingProgress: boolean;
isSubmitting: boolean;
isEndingSession: boolean;
completeLevel<T>(data: T): void;
};

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);
type CompleteLevelType = ResultData & {
    levelType: LevelType;
};
export const ChallengesProvider = ({ children }: ChallengeProviderProps) => {
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { levelId, courseId } = useParams();
  const navigate = useNavigate();
  const queries = useQueryClient();
  const { data: { currentCourse }, isFetching } = useRoot();
  const { data: response, isError, refetch, isPending: isFetchingProgress } = useGetQuery<ResponseData<{ levelProgress: LevelProgressType }>>({
    enabled: currentCourse !== null && levelId !== undefined && courseId !== undefined && !isFetching,
    queryKey: ['courses', currentCourse?.id, 'levels', levelId],
    route: `/courses/${currentCourse?.id}/levels/${levelId}`,
    defaultMessage: "failed to get level progress!"
  });
  const { state: { auth } } = useAuth();
  function updateResultData(data: ResultData) {
    setResultData(data);
  }
  const { mutate, isPending: isSubmitting } = useMutate({
    method: 'post',
    route: `/students/${auth?.profileId}/complete-level`,
    defaultMessage: "failed to complete level!",
    onSuccess(response: ResponseData<CompleteLevelType>) {
        const result = response.data?.body;
        console.log("in challenges provider: ",result)
        if(result){
            updateResultData({...result});
            // invalidate queries in user progress header, learn page
            queries.invalidateQueries({
              queryKey:["student", auth?.profileId, 'student-progress'], 
              exact: true
            });
            queries.invalidateQueries({
              queryKey:["curriculum", currentCourse?.id], 
              exact: true
            });
            queries.invalidateQueries({
              queryKey:["courseProgress", currentCourse?.id, auth?.profileId], 
              exact: true
            });
            navigate(`/challenge/${courseId}/level/${levelId}/result?type=${result.levelType}`);
        }
    },
  });
  const {mutate: endSession, isPending: isEndingSession} = useMutate({
    method: 'patch',
    route: `/students/${auth?.profileId}/level-progress/${levelId}`,
    defaultMessage: "failed to end session",
    onSuccess() {
    // invalidate the query of learn page.
      navigate(`/learn/${currentCourse?.id}`);
    },
  });
  useEffect(() => {
    checkLevelProgress();
  }, [response]);

  const checkLevelProgress = () => {
    if (response?.data.body?.levelProgress?.completedLevel) {
      setLevelCompleted(true);
      setOpenModal(true);
    }
  };
  function handleEndSession(data:{currentQuizNumber?: number, currentLessonNumber?: number}) {
    endSession(data);
  }
  function completeLevel<T> (data: T){
    // end session and update level progress i.e submit result of answwering challenges
    mutate(data);
  };
  
  if(isError){
    return <ErrorMessage
        refetch={refetch}
    />
  }
  return (
    <ChallengeContext.Provider value={{isFetchingProgress, isSubmitting, resultData, levelCompleted, isEndingSession,  handleEndSession, completeLevel }}>
      <Dialog open={openModal} onOpenChange={prev => setOpenModal(prev)}>
        <DialogContent>
          <img src="path/to/monster-image" alt="Concerned Monster" className="h-32 w-32 mx-auto object-contain" />
          <DialogDescription className="font-medium text-lg text-center">
            You have already completed this level. Rewards will be reduced.
          </DialogDescription>
          <DialogFooter className="flex flex-col space-y-3.5 !space-x-0 mt-4">
            <Button variant="danger" className="max-w-full" onClick={() => navigate(`/learn/${currentCourse?.id}`)}>End Session</Button>
            <Button variant='primary' className='max-w-full' onClick={() => setOpenModal(false) }>Continue Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenge = () => {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallenge must be used within a ChallengeProvider');
  }
  return context;
};
