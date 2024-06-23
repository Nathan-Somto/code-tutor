<script setup lang="ts">
import StatsCard from '@/components/home/StatsCard.vue'
import { Input } from '@/components/ui/input'
import { SearchIcon, PlusIcon, PenIcon } from 'lucide-vue-next'
import CourseCard from '@/components/home/CourseCard.vue'
import {DashboardHeader} from '@/components/dashboard-header'
import {Button} from "@/components/ui/button";
import { useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { getDashboardInfoService } from '@/services/course';
import { useAuthStore } from '@/stores/auth';
import { watchEffect } from 'vue'
import { AxiosError } from 'axios'
interface DashboardData {
  body: {
    studentsCount: number;
    coursesCount: number;
    teacherCourses: {
      id: string;
      title: string;
      levelsCount: number;
      topicsCount: number;
    }[];
  };
}
const { auth } = useAuthStore();
const $router = useRouter();
console.log(auth?.profileId);
let dashboardInfo: DashboardData['body'] | undefined;
const { isPending, isError, error, data: response } = useQuery({
  queryKey: ['dashboard', auth?.profileId],
  queryFn: () => getDashboardInfoService(auth?.profileId ?? ''),
  retry(failureCount, error) {
    if (error instanceof AxiosError && error?.response?.status === 404) {
      return false;
    }
    return failureCount < 3;
  },
  refetchOnMount: false,
});
console.log(response?.value);
watchEffect(() => {
  if (response?.value?.data) {
    console.log(response.value.data);
    dashboardInfo = (response.value.data as DashboardData).body;
  }
});
const onButtonClick = (id: string) => {
  console.log(id);
};
const onCreateCourseClick = () => {
  $router.push(`/dashboard/courses/new`);
}
const onStudentsClick = () => {
  $router.push('/dashboard/students');
}
</script>


<template>
  <div>
    <DashboardHeader title="Dashboard" showAvatar>
      <Button size="sm" @click='onCreateCourseClick'>
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Course
      </Button>
      <Button variant="secondary" size="sm">
        <PenIcon class="w-4 h-4 mr-2" />
        Contribute
      </Button>
    </DashboardHeader>

    <div class="w-full bg-gray-100 min-h-screen dark:bg-gray-950 p-4 md:p-6 lg:p-8">
      <template v-if="isPending">
        <div class="flex flex-col gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="h-24 bg-gray-300 dark:bg-gray-800 animate-pulse rounded-md"></div>
            <div class="h-24 bg-gray-300 dark:bg-gray-800 animate-pulse rounded-md"></div>
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-md shadow-sm p-4">
            <div class="flex items-center mb-4">
              <div class="w-5 h-5 bg-gray-300 dark:bg-gray-800 animate-pulse mr-2"></div>
              <div class="flex-1 h-5 bg-gray-300 dark:bg-gray-800 animate-pulse"></div>
            </div>
            <div class="space-y-4">
              <div class="h-6 bg-gray-300 dark:bg-gray-800 animate-pulse rounded-md"></div>
              <div class="h-6 bg-gray-300 dark:bg-gray-800 animate-pulse rounded-md"></div>
              <div class="h-6 bg-gray-300 dark:bg-gray-800 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="isError">
        <div class="flex items-center text-center flex-col">
          <h3 class="text-xl font-medium mb-3">Failed to fetch Dashboard information</h3>
          <p class="opacity-80 tracking-wider">{{ error?.message }}</p>
        </div>
      </template>
      <template v-else-if="dashboardInfo">
        <main>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StatsCard title="Students" :value="dashboardInfo.studentsCount" @click="onStudentsClick" />
            <StatsCard title="Courses" :value="dashboardInfo.coursesCount" />
          </div>

          <div class="bg-white dark:bg-gray-900 rounded-md shadow-sm">
            <div class="p-4 border-b dark:border-gray-800">
              <div class="flex items-center">
                <SearchIcon class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  class="flex-1 bg-transparent border-none focus:ring-0 dark:text-gray-50"
                />
              </div>
            </div>
          </div>

          <div class="p-4">
            <template v-if="dashboardInfo.teacherCourses.length === 0">
              <div class="text-center">No courses found</div>
            </template>
            <template v-else>
              <div class="grid gap-4">
                <CourseCard
                  v-for="course in dashboardInfo.teacherCourses"
                  :key="course.id"
                  :id="course.id"
                  :courseTitle="course.title"
                  :levels="course.levelsCount"
                  :topics="course.topicsCount"
                  :onButtonClick="onButtonClick"
                />
              </div>
            </template>
          </div>
        </main>
      </template>
    </div>
  </div>
</template>
