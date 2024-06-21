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
    return axios.post('/courses',data);
};
export function getDashboardInfoService(profileId: string){
    return axios.get(`/teacher/${profileId}/dashboard`);
}
export function getCourseService(courseId: string){
    return axios.get(`/courses/${courseId}`);
}
export function getEnrolledStudentsService(courseId: string){
    return axios.get(`/courses/${courseId}/enrolled-students`)
}