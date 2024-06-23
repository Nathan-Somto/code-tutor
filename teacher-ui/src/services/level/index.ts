import apiClient from "@/config/apiClient";
import axios from "axios";

export type CreateLevelType = 
    {
        name: string;
        topicId: string;
        gems: number;
        xp: number;
        mysteryLevel: boolean;
        difficulty: "Easy" | "Medium" | "Hard" | "Advanced" | "Expert";
        levelType: "Lesson" | "Quiz" | "Code";
    }
export type CreateChallengeType = (Record<string,unknown> | Record<string,unknown>[])& {
    levelType: CreateLevelType['levelType'];
    levelId: string;
}
export function createLevelService(courseId:string, topicId: string, data:CreateLevelType){
    return apiClient.post(`/courses/${courseId}/topics/${topicId}/levels`, data)
}
export function createChallengeService(courseId: string, topicId: string, data: CreateChallengeType){
return apiClient.post(`/courses/${courseId}/topics/${topicId}/levels/${data.levelType.toLowerCase()}`, data)
}