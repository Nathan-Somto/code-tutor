import apiClient from "@/config/apiClient";
import axios from "axios";
export type CourseType = {
    title: string;
    description: string;
    creatorId: string;
    contributorIds: string[];
    language: string;
    image_url?: string | undefined;
}
export function createCourseService(data: CourseType){
    return apiClient.post('/courses',data);
};
export function getDashboardInfoService(profileId: string){
    console.log(`http://localhost:4000/api/teachers/${profileId}/dashboard`);
    return apiClient.get(`/teachers/${profileId}/dashboard`);
}
export function getCourseService(courseId: string){
    return apiClient.get(`/courses/${courseId}`);
}
export function getEnrolledStudentsService(courseId: string){
    return apiClient.get(`/courses/${courseId}/enrolled-students`)
}