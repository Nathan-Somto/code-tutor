import apiClient from "@/config/apiClient";
import type { Topic } from "@/views/CourseView.vue";


export function createTopicService(courseId: string, data: Partial<Topic> & {courseId: string}){
    return apiClient.post(`/courses/${courseId}/topics`, data)
}
export function getTopicLevelsService(courseId: string, topicId: string){
    return apiClient.get(`/courses/${courseId}/topics/${topicId}/levels`)
}