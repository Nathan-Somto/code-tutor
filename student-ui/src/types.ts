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
export type StreakType = {
    history: StreakNumber[];
    currentStatus: StreakNumber;
    currentDate: Date;
    currentCount: number;
}; 
export type StreakNumber = 0 | 1 | 2;
export type BadgesType = {
            name: string;
            image: string;
            description: string;
            achieved: boolean;
            achievementDate: Date;
            xTimes: number;
}
export type StudentProgress = {
    progressData: {
        streaksData: StreakType ;
        gems: number;
        rank: Difficulty;
        xpPoints: number;
        unlockedBadges: BadgesType[]
    }
}

type QuizType = "MULTIPLE_CHOICE" | "COMPLETE_SEQUENCE" | "MATCHING_PAIRS"
export type QuizChallengeType ={
    id: string;
    levelId: string;
    question: string | null;
    answer: string;
    options: string[];
    quizType: QuizType;
}
type LessonType = {
    id: string;
    content: string[];
    levelId: string;
}
type ChallengeType = "FIX_THE_BUG" |"ALGORITHM" |"COMPLETE_CODE"
export type TestResults = {
    input: null  |  string;
    description: string;
    expectedOutput: string;
    passed: null | boolean;
    output: string;
}[];
export type TestCase = {
    
    id: string;
    codeChallengeId: string;
    input: string;
    expectedOutput: string;
    description: string;
}

export type CodeChallengeType = {
    id: string;
    levelId: string;
    starterFile: string;
    starterCode: string;
    language: string;
    challengeType: ChallengeType;
    functionName?: string;
    testCases: TestCase[];
};
export type LevelDataType = {
    gems: number;
    xp: number;
    difficulty: Difficulty;
    id: string;
    name: string;
    lesson?: LessonType;
    code?: CodeChallengeType;
    quiz: QuizChallengeType;
}
export type CompleteLevelType = {
    courseId: string;
    levelId: string;
}
export type ResultData = {
    gains: {
      xpGained: number;
      gemsGained: number;
    };
    streaks?: StreakType;
    badges?: {
      image: string;
      name: string;
      description: string;
    };
    rank?: keyof typeof Rank;
  };
export type LevelProgressType = {
        currentQuizNumber: number;
        currentLessonNumber: number;
        completedLevel: boolean;
    
}
export type CodeSolutionType = {
        courseId: string;
        answer: string;
        levelId: string;
        codeChallengeId: string;   
}
export type LeaderboardType = {
    leaderboard: {
        position: number;
        id: string;
        username: string;
        rank: Difficulty;
        xpPoints: number;
        user: {
            name: string;
            profile_photo: string | null;
        };
    }[];
}
export type ProfileType = {
    gems: number;
    rank: Difficulty;
    username: string;
    streakCount: number;
    badges: BadgesType[];
    name: string;
    profile_photo: string | null;
    joinedAt: Date;
    xpPoints: number;
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