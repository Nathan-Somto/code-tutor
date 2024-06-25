// provider for fetching the curriculum for a particular course, getting the course progress of a user.
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGetQuery } from '@/hooks/query/useGetQuery';
import { useAuth } from '@/providers/AuthProvider';
import { Curriculum, CourseProgress, ResponseData } from '@/types';
import { RootProps, useRoot } from './RootProvider';

type LearnContextType = {
  curriculum: Curriculum | null;
  courseProgress: CourseProgress | null;
  updateCourseProgress: (progress: CourseProgress) => void;
  setCourseProgress: (progress: CourseProgress) => void;
    isFetchingCurriculum: boolean;
    isFetchingCoursePogress: boolean;
    curriculumError: boolean;
    courseProgressError: boolean;
    refetch: () => void;
};

const LearnContext = createContext<LearnContextType | undefined>(undefined);

export const useLearn = () => {
  const context = useContext(LearnContext);
  if (context === undefined) {
    throw new Error('useLearn must be used within a LearnProvider');
  }
  return context;
};

function LearnProvider ({ children }: {children: React.ReactNode}) {
  const { state } = useAuth();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgress | null>(null);
  const {data:{currentCourse}, isFetching} = useRoot() as RootProps; // get the current course from the global store
    
  const { data: curriculumResponse, isPending: isFetchingCurriculum, isError: curriculumError, refetch: refetchCurriculum } = useGetQuery<ResponseData<Curriculum>>({
    enabled: currentCourse !== null && !isFetching, // to ensure first render is not called before the currentCourse is set
    route: `/courses/${currentCourse?.id}/curriculum`,
    queryKey: ["curriculum", currentCourse?.id],
    displayToast: false,
  });

  const { data: courseProgressResponse, isPending: isFetchingCoursePogress, isError: courseProgressError, refetch: refetchCourseProgress } = useGetQuery<ResponseData<CourseProgress>>({
    enabled: currentCourse !== null && courseProgress === null && !isFetching,
    route: `/students/${state.auth?.profileId}/course-progress/${currentCourse?.id}`,
    queryKey: ["courseProgress", currentCourse?.id, state.auth?.profileId],
    displayToast: false,
  });

  useEffect(() => {
    const curriculumData = curriculumResponse?.data?.body;
    if (curriculumData) {
      setCurriculum(curriculumData);
    }
  }, [curriculumResponse]);

  useEffect(() => {
    const courseProgressData = courseProgressResponse?.data?.body;
    if (courseProgressData) {
      setCourseProgress(courseProgressData);
    }
  }, [courseProgressResponse]);

  const updateCourseProgress = (progress: CourseProgress) => {
    setCourseProgress(progress);
  };
  const refetch = () => {
    refetchCurriculum();
    refetchCourseProgress();
  }
  const value = {
    curriculum,
    courseProgress,
    updateCourseProgress,
    setCourseProgress,
    isFetchingCurriculum,
    isFetchingCoursePogress,
    curriculumError,
    courseProgressError,
    refetch
  };

  return (
    <LearnContext.Provider value={value}>
      {children}
    </LearnContext.Provider>
  );
};

export default LearnProvider;
