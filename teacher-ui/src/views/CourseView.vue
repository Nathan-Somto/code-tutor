<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { UsersIcon, PlusIcon } from 'lucide-vue-next'
import StatsCard from '@/components/home/StatsCard.vue'
import Topic from '@/components/course/Topic.vue'
import courseData from '@/components/course/data.json'
import CreateTopicDialog from '@/components/modals/CreateTopicDialog.vue'
import {onMounted} from "vue"
export type Topic = {
  id: string
  name: string
  description: string
}
const topics = ref<Topic[]>([])
const open = ref(false)
function addTopic(topic: Topic) {
  console.log(topic)
  topics.value =[...topics.value, topic]
}
function moveToIndex(oldOrder: number, newOrder: number) {
  if(topics.value.length < newOrder || topics.value.length > newOrder ) return
  //basically swap two elements in the array , use some js syntactic sugar
  [topics.value[oldOrder], topics.value[newOrder]] = [topics.value[newOrder], topics.value[oldOrder]]
  console.log('changed!')
}
function updateOpen(newOpenValue: boolean){
  open.value = newOpenValue;
}
// on mount set the topics in course data
onMounted(() => {
  topics.value = courseData.topics
})
</script>
<template>
  <!-- Secondary header -->
  <!-- (img beside) name of the course, button to view enrolled students, button to create a topic(opens a modal) -->
  <header class="py-4 px-6 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <img
        src="@/assets/python.png"
        alt="course image"
        className="h-8 w-10 flex-shrink-0 rounded-md object-contain"
      />
      <h1 class="text-2xl font-bold">Introduction to Python</h1>
    </div>
    <div class="flex items-center gap-4">
      <Button variant="outline">
        <UsersIcon />
        View Students
      </Button>
      <Button class="gap-2" @click="() => (open = true)">
        <PlusIcon />
        Create Topic
      </Button>
    </div>
  </header>
  <div class="bg-gray-200 px-6 min-h-screen w-full dark:bg-gray-950">
    <!-- Statstics -->
    <section class="py-5 px-3">
      <h2 class="text-xl mb-4">Statistics</h2>
      <!-- Total topics, Enrolled students -->
      <div class="grid grid-cols-2 gap-3">
        <StatsCard title="Total Topics" :value="8" />
        <StatsCard title="Enrolled Students" :value="29" />
      </div>
    </section>
    <section>
      <div class="grid gap-6">
        <Topic
          v-for="(topic, index) in topics"
          :id="topic.id"
          :order="index"
          :description="topic.description"
          :name="topic.name"
          :moveToIndex="moveToIndex"
          :key="topic.id"
        />
      </div>
    </section>
    <!-- Topics -->
    <!-- topic name, topic description chevron down total levels number -->
    <!-- at the end of the displayed topics levels (show add new level button) -->
  </div>
  <!-- Footer -->
  <!-- contributors image with the creator of course image showing first. -->
  <CreateTopicDialog :open="open" :addTopic="addTopic" :updateOpen="updateOpen" />
</template>
