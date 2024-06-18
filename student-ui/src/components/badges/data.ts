import Learner from "@/assets/badges/learner.svg"
import Code from "@/assets/badges/ninja.svg"
import Quiz from "@/assets/badges/quiz.svg"
import Xp from "@/assets/badges/xp.svg"
import { BadgesType } from "."
export const imageMap = {
    "Learner": Learner,
    "Code": Code,
    "Quiz": Quiz,
    "Xp": Xp
}
export const BadgesData :BadgesType[] = [
     {
            "description": "complete at least 10 quizzes",
            "name": "Quiz Master",
            "image": "Quiz",
            "achievementDate": "2022-01-01T00:00:00.000Z",
            "xTimes": 2,
        }, {
            "description": "complete at least 10 code challenges",
            "name": "Code Ninja",
            "image": "Code",
            "achievementDate": "2024-02-01T00:00:00.000Z",
            "xTimes": 3,
        }, {
            "description": "complete at least 10 lessons",
            "name": "Active Learner",
            "image": "Learner",
            "achievementDate": "2024-03-01T00:00:00.000Z",
            "xTimes": 1
        }, 
        {
            "description": "gain at least 500xp",
            "name": "Xp Champ",
            "image": "Xp",
            "achievementDate": "2024-03-01T00:00:00.000Z",
            "xTimes": 1
        }
]