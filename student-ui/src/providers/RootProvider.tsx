import React from "react"
import { useAuth } from "./AuthProvider";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { ApiResponseType, ResponseData, StudentProgress } from "@/types";
export type StreakNumber = 0 | 1 | 2;
// 1-complete 0-no lesson, 2-froze
type CurrentCourse ={
    id: string;
    imageSrc: string;
    title: string;

}
export type RootProviderProps = {
    currentCourse: CurrentCourse | null;
} & StudentProgress["progressData"]
export type RootProps = {
    data: RootProviderProps,
    setData: React.Dispatch<React.SetStateAction<RootProviderProps>>,
    isFetching: boolean;
}
const RootContext = React.createContext<RootProps | null>(null);
export const useRoot = () => React.useContext(RootContext);
export default function RootProvider({children}:{ children: React.ReactNode }){
    const [data, setData] = React.useState<RootProviderProps>({
        currentCourse: null,
        streaksData:{
            currentCount: 0,
            /* the days in the streak in an array of objects format [1], value [1-complete 0-no lesson, 2-froze], index refers to the day */
            history: [0,0,0,0,0,0,0],
            currentDate: new Date(), // e.g Monday,Tuesday
            currentStatus: 0, // 0 - no lesson, 1 - complete, 2 - froze

        },
        xpPoints: 0,
        gems: 50,
        rank: "Easy"
    });
    const {state: {auth}} = useAuth();
    // get the current logged in user's id from the useAuth hook fetch the user's data from the server and set it to the data state
    // for now populate with fake data
    const {data: studentProgress, isPending} = useGetQuery<ResponseData<StudentProgress>>({
        enabled: auth?.profileId !== null,
        route: `/students/${auth?.profileId}/student-progress`,
        queryKey: ["student", auth?.profileId, 'student-progress'],
        displayToast: false
    })
    React.useEffect(() => {
        const currentCourse = JSON.parse(localStorage.getItem('current-course') ?? '{}');

        setData((prev) => ({
            ...prev,
            currentCourse: JSON.stringify(currentCourse) === '{}' ? null : currentCourse, 
        }))
    },[]);
    React.useEffect(() => {
        if(studentProgress?.data){
            setData((prev) => ({
                ...prev,
                streakData: studentProgress?.data?.body?.progressData?.streaksData,
                totalXp: studentProgress?.data?.body?.progressData?.xpPoints,
                gems: studentProgress?.data?.body?.progressData?.gems
            }))
        }
    }, [studentProgress])
    return (
        <RootContext.Provider value={{
            data,
            setData,
            isFetching: isPending
        }}>
            {children}
        </RootContext.Provider>
    )
}