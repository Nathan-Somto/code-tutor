// src/stores/studentStore.ts
import { defineStore } from 'pinia'
export type StudentInfo = {
        profile_photo: string
        id: string
        name: string
        username: string
        currentLevel: number
        xp: number
        totalCodeSubmissions: number
}
type StudentStore = {
    students: StudentInfo[]
}
export const useStudentStore = defineStore('studentStore', {
  state: (): StudentStore => ({
    students: [] 
  }),
  actions: {
    addStudent(student: StudentInfo) {
      this.students.push(student)
    },
    setStudents(students: StudentInfo[]){
        this.students = students
    },
    disableStudent(studentId: string) {
      const student = this.students.find(s => s.id === studentId)
      if (student) {
        // handle disabling student logic
      }
    }
  }
})
