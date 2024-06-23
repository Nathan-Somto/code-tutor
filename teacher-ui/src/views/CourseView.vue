<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Button } from '@/components/ui/button'
import { UsersIcon, PlusIcon } from 'lucide-vue-next'
import StatsCard from '@/components/home/StatsCard.vue'
import Topic from '@/components/course/Topic.vue'
// import courseData from '@/components/course/data.json'
import CreateTopicDialog from '@/components/modals/CreateTopicDialog.vue'
import {useRouter, useRoute} from "vue-router"
import { useQuery } from '@tanstack/vue-query'
import { getCourseService } from '@/services/course'
import {AvatarImage, Avatar, AvatarFallback }from '@/components/ui/avatar'
import { AxiosError } from 'axios'
type CourseData = {
  body: {
    contributors: {
    name: string
    profile_photo: string | null
  }[]
  title: string
  image_url: string | null
  id: string
  topics: {
    id: string
    description: string
    name: string
    order: number
  }[]
  enrolledStudentsId: string[]
}
}
export type Topic = {
  id: string
  name: string
  order: number
  description: string
}
const $router = useRouter()
const $route = useRoute()
const topics = ref<Topic[]>([])
const open = ref(false);
const changingOrder = ref(false);
let courseData: CourseData['body'] | null = null;
const {isLoading, isError, data: response} = useQuery({
  queryKey: ['course', $route.params.id],
  queryFn: () => getCourseService($route.params.id as string),
  retry(failureCount, error) {
    if (error instanceof AxiosError && error?.response?.status === 404) {
      return false;
    }
    return failureCount < 3;
  },
  refetchOnMount: false
});
watchEffect(() => {
  if (response?.value?.data) {
    courseData = (response.value.data as CourseData)?.body; // Assign to courseData
    topics.value = courseData.topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      order: topic.order,
    })).sort((a, b) => a.order - b.order); // Sort topics by order
  }
});
console.log(open.value)
async function moveToIndex(oldOrder: number, newOrder: number) {
  try{
  if(topics.value.length < newOrder || topics.value.length > newOrder ) return
  //basically swap two elements in the array , use some js syntactic sugar
  [topics.value[oldOrder], topics.value[newOrder]] = [topics.value[newOrder], topics.value[oldOrder]]
  console.log('changed!')
  }catch(err){
    console.log(err)
  }
}
function updateOpen(newOpenValue: boolean){
  open.value = newOpenValue;
}
function openDialog() {
  open.value = true;
  console.log('clicked', open.value)
}
function redirectToEnrolledStudents(){
  $router.push(`/dashboard/courses/${$route.params.id}/enrolled-students`)
}
// whenever the course data changes, update the topics

</script>

<template>
  <template v-if="isLoading">
    <div class="animate-pulse">
      <!-- Secondary header skeleton -->
      <header class="py-4 px-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
        </div>
        <div class="flex items-center gap-4">
          <div class="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          <div class="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        </div>
      </header>
      <div class="bg-gray-200 px-6 min-h-screen w-full dark:bg-gray-950">
        <!-- Statistics skeleton -->
        <section class="py-5 px-3">
          <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-4"></div>
          <div class="grid grid-cols-2 gap-3">
            <div class="h-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div class="h-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        </section>
        <!-- Topics skeleton -->
        <section class="py-5 px-3">
          <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-4"></div>
          <div class="grid gap-6">
            <div class="h-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div class="h-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div class="h-10 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        </section>
        <!-- Contributors skeleton -->
        <section class="py-5 px-3">
          <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-4"></div>
          <div class="flex gap-2">
            <div class="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div class="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div class="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
        </section>
      </div>
    </div>
  </template>
  <template v-else-if="isError">
    <div>There was an unexpected error!</div>
  </template>
  <template v-else-if="courseData">
    <!-- Secondary header -->
    <header class="py-4 px-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img
          :src="courseData.image_url ?? 'https://via.placeholder.com/150'"
          alt="course image"
          class="h-10 w-10 flex-shrink-0 rounded-md object-cover"
        />
        <h1 class="text-2xl font-bold">{{ courseData.title }}</h1>
      </div>
      <div class="flex items-center gap-4">
        <Button variant="outline" @click="redirectToEnrolledStudents">
          <UsersIcon />
          View Students
        </Button>
        <Button class="gap-2" @click="openDialog">
          <PlusIcon />
          Create Topic
        </Button>
      </div>
    </header>
    <div class="bg-gray-200 px-6 min-h-screen w-full dark:bg-gray-950">
      <!-- Statistics -->
      <section class="py-5 px-3">
        <h2 class="text-xl mb-4">Statistics</h2>
        <div class="grid grid-cols-2 gap-3">
          <StatsCard title="Total Topics" :value="courseData.topics.length" />
          <StatsCard
            title="Enrolled Students"
            :value="courseData.enrolledStudentsId.length"
            :onClick="redirectToEnrolledStudents"
          />
        </div>
      </section>
      <!-- Topics -->
      <section>
        <div class="grid gap-6">
          <h2 class="text-xl mb-4">Topics</h2>
          <template v-if="topics.length === 0">
            <p class="text-center text-lg mt-4 font-medium tracking-tighter mb-3">
              No topics available
            </p>
            <Button class="gap-2 max-w-fit mx-auto" @click="openDialog">
              <PlusIcon />
              Add a Topic
            </Button>
          </template>
          <template v-else>
            <Topic
              v-for="(topic) in topics"
              :id="topic.id"
              :order="topic.order"
              :description="topic.description"
              :name="topic.name"
              :moveToIndex="moveToIndex"
              :key="topic.id"
            />
          </template>
        </div>
      </section>
      <!-- Contributors -->
      <div>
        <h2 class="text-xl mb-4">Contributors</h2>
        <div class="flex gap-2">
          <template v-for="contributor in courseData.contributors">
            <div class="flex flex-wrap gap-2 items-center">
              <div class="flex flex-col gap-y-2">
                <Avatar>
                  <AvatarImage
                    :src="contributor.profile_photo ?? 'https://via.placeholder.com/150'"
                    alt="contributor image"
                    class="h-8 w-8 rounded-full object-cover"
                  />
                  <AvatarFallback class="uppercase">{{ contributor.name.length > 2 ? contributor.name[0] + contributor.name[1] : '' }}</AvatarFallback>
                </Avatar>
                <span class="">{{ contributor.name }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <CreateTopicDialog :open="open" :updateOpen="updateOpen" />
  </template>
</template>

