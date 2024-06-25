export type CourseProgress = {
    id: string;
    topicId: string; // current topic id
    levelId: string; // current level id
    courseId: string;
    isCompleted: boolean;
    currentLevel: {
        progress: number;
        id: string;
    }
}
export enum Rank {
    Easy = 5,
    Medium = 4,
    Hard = 3,
    Advanced = 2,
    Expert = 1,
  };
export type Difficulty = keyof typeof Rank;
export type LevelType = "lesson" | "quiz" | "code";
export type Curriculum = { 
    topics: {
    totalXp: number;
    id: string;
    description: string;
    name: string;
    Level: {
        id: string;
        name: string;
        xp: number;
        mysteryLevel: boolean;
        difficulty: Difficulty;
        levelType:  LevelType;
    }[];
}[];
}
export type StreakNumber = 0 | 1 | 2;
export type StudentProgress = {
    progressData: {
        streaksData: {
            history: StreakNumber[];
            currentStatus: StreakNumber;
            currentDate: Date;
            currentCount: number;
        };
        gems: number;
        rank: Difficulty;
        xpPoints: number;
    }
}
export type ApiResponseType<T> = {
    body: T;
    message: string;
    success: boolean;
    timestamp: Date;
}
export type ResponseData<T> = {
    data: ApiResponseType<T>;
  };