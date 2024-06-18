import React from "react"
export type StreakNumber = 0 | 1 | 2;
// 1-complete 0-no lesson, 2-froze
export type RootProviderProps = {
    currentCourse: string;
    streakData: {
        currentCount: number;
        days: StreakNumber[];
        currentDay: number;
    };
    hints: {
        totalHints: number;
        refreshDate: null | Date;
    };
    totalXp: number;
    gems: number;
}
export type RootProps = {
    data: RootProviderProps,
    setData: React.Dispatch<React.SetStateAction<RootProviderProps>>
}
const RootContext = React.createContext<RootProps | null>(null);
export const useRoot = () => React.useContext(RootContext);
export default function RootProvider({children}:{ children: React.ReactNode }){
    const [data, setData] = React.useState<RootProviderProps>({
        currentCourse: "",
        streakData:{
            currentCount: 0,
            /* the days in the streak in an array of objects format [1], value [1-complete 0-no lesson, 2-froze], index refers to the day */
            days: [0,0,0,0,0,0,0],
            currentDay: 4 // e.g Monday,Tuesday

        },
        hints : {
            totalHints: 5,
            refreshDate: null
        },
        totalXp: 0,
        gems: 50
    });
    //const {userId} = useAuth();
    // get the current logged in user's id from the useAuth hook fetch the user's data from the server and set it to the data state
    // for now populate with fake data
    React.useEffect(() => {
        const currentCourse = localStorage.getItem('root-courseId');
        setData({
            currentCourse: currentCourse ?? "",
            streakData:{
                currentCount: 3,
                days: [0,2,1,1,0,0,0],
                currentDay: new Date().getDay()
            },
            hints : {
                totalHints: 5,
                refreshDate: null
            },
            totalXp: 350,
            gems: 100
        })
    },[])
    return (
        <RootContext.Provider value={{
            data,
            setData
        }}>
            {children}
        </RootContext.Provider>
    )
}