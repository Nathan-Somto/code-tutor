<script setup lang="ts">
import { onMounted } from 'vue'
import { columns } from '@/components/students-table/column'
import DataTable from '@/components/students-table/data-table.vue'
import  {useStudentStore, type StudentInfo } from '@/stores/students';
import studentData from "@/components/students-table/data.json";
import {DashboardHeader} from "@/components/dashboard-header";
import {DownloadIcon} from "lucide-vue-next";
import {Button} from "@/components/ui/button";
const studentStore = useStudentStore()

async function getData(): Promise<StudentInfo[]> {
  // Fetch data from your API here.
  return studentData
}
const handleExport = () => {
  
  const students = studentStore.students
  const csvContent = convertToCSV(students)
  
 
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  
  
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', 'students.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const convertToCSV = (data: any[]) => {
  // Extract headers
  const headers = Object.keys(data[0])
  
  // Map data to CSV rows
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header]
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    }).join(',')
  })

  // Combine headers and rows
  return [headers.join(','), ...csvRows].join('\n')
}
onMounted(async () => {
  studentStore.setStudents( await getData())
})
</script>

<template>
    <DashboardHeader title="Enrolled Students" showAvatar>
        <Button variant="outline" @click="handleExport" class="gap-x-1.5"><DownloadIcon/> Export as CSV </Button>
    </DashboardHeader>
  <div class="container py-10 mx-auto">
    <DataTable :columns="columns" :data="studentStore.students" />
  </div>
</template>