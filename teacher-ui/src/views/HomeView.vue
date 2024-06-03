<script setup lang="ts">
import Header from '@/components/home/Header.vue'
import StatsCard from '@/components/home/StatsCard.vue'
import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-vue-next'
import CourseCard from '@/components/home/CourseCard.vue'
import Sidebar from "@/components/layout/sidebar.vue"
const data = [
  {
    id: 1,
    text: 'Introduction to Python',
    levels: 150,
    topics: 8
  },
  {
    id: 2,
    text: 'C++',
    levels: 125,
    topics: 6
  },
  {
    id: 3,
    text: 'Java',
    levels: 220,
    topics: 9
  }
]
const onButtonClick = (id: string) => {
  console.log(id)
}
</script>

<template>
  <Sidebar/>
  <div class="min-h-screen ml-[250px] w-[calc(100vw-250px)]">
    <div class="w-full bg-gray-100 dark:bg-gray-950 p-4 md:p-6 lg:p-8">
      <Header />
      <main>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatsCard title="Students" :value="49" />
          <StatsCard title="Courses" :value="8" />
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
        <div className="p-4">
          <div className="grid gap-4">
            <CourseCard
              v-for="item in data"
              :id="item.id"
              :courseTitle="item.text"
              :levels="item.levels"
              :topics="item.topics"
              :onButtonClick="onButtonClick"
              :key="item.id"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
