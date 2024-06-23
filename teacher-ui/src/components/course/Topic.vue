<script setup lang="ts">
import { ref, watch } from 'vue'
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-vue-next'
import { CodeIcon, BookOpenIcon, FileQuestionIcon } from 'lucide-vue-next'
import {RouterLink} from "vue-router"
import { Button } from '@/components/ui/button'
import { useRouter, useRoute } from 'vue-router'
import courseData from '@/components/course/data.json'
import type { DifficultyKeys } from '../modals/GamificationRules.vue'
import { getTopicLevelsService } from '@/services/topic'
import { useQuery } from '@tanstack/vue-query'
import { AxiosError } from 'axios'
const element = defineProps<{
  id: string
  name: string
  order: number
  description: string
  moveToIndex: (oldOrder: number, newOrder: number) => void
}>()
type LevelType = 'Code' | 'Lesson' | 'Quiz'
const IconMap = { Code: CodeIcon, Lesson: BookOpenIcon, Quiz:  FileQuestionIcon }
type Level = {
    id: string;
    name: string;
    order: number;
    difficulty: DifficultyKeys;
    levelType: LevelType;
    xp: number;
}
type ResponseData = {
  body:Level[]
 
}
const $router = useRouter()
const $route = useRoute()
const newIndex = ref()
const showLevels = ref(false)
const levels = ref<Level[] | null>(null)
console.log(element.id)
const {data: response,  isPending, refetch} = useQuery({
  queryKey: ['course', $route.params.id, element.id],
  queryFn: () => getTopicLevelsService($route.params.id as string, element.id),
  enabled: false,
  retry(failureCount, error) {
    if (error instanceof AxiosError && error?.response?.status === 404) {
      return false
    }
    return failureCount < 3
  }

})
watch(showLevels, (newValue) => {
  if (newValue && levels.value === null) {
    refetch()
  }
})
// if showLevels is true and levels is not null, find the levels associated with this topic
watch( response, (newValue) => {
  console.log('in watch ',newValue?.data)
  if ( newValue?.data?.body) {
    levels.value =  (newValue.data as ResponseData)?.body?.map((level: Level) => ({
      id: level.id,
      name: level.name,
      order: level.order,
      difficulty: level.difficulty,
      levelType: level.levelType,
      xp: level.xp
    })).sort((a: Level, b: Level) => a.order - b.order)
  }
})
function applyNewIndex() {
  element.moveToIndex(element.order, newIndex.value)
}
</script>

<template>
  <div class="bg-white p-4 rounded-lg dark:bg-gray-950">
    <div class="flex flex-col mb-4">
      <GripVerticalIcon class="w-4 h-4 cursor-grab drag-handle opacity-80" />
      <div class="flex items-center px-5">
        <label for="index-{{ element.id }}" class="mr-2">Move to index:</label>
        <input
          type="number"
          id="index-{{ element.id }}"
          min="1"
          max="topics.length"
          v-model="newIndex"
          :placeholder="element.order.toString()"
          class="w-16 p-1 border rounded border-gray-200"
        />
        <template v-if="newIndex >= 0">
          <Button variant="secondary" @click="applyNewIndex" class="ml-2 bg-slate-200"
            >Apply</Button
          >
        </template>
      </div>
      <div class="flex items-center px-5 justify-between">
        <div>
          <h3 class="text-lg font-bold">{{ element.name }}</h3>
          <p class="opacity-80">{{ element.description }}</p>
        </div>
        <Button variant="ghost" size="icon" @click="showLevels = !showLevels">
          <ChevronDownIcon v-if="!showLevels" class="w-5 h-5" />
          <ChevronUpIcon v-else class="w-5 h-5" />
        </Button>
      </div>
    </div>
    <!-- Only show levels if showLevels is true -->
    <template v-if="showLevels">
      <template v-if="isPending">
        <p class="">Loading Levels...</p>
      </template>
      <!-- Loop through all the levels -->
       <tempalte v-if="levels !== null">
        <template v-if="levels.length > 0">         
          <ul class="divide-y">
          <li v-for="level in levels" :key="level.id" class="flex items-center  cursor-pointer hover:bg-gray-200 rounded-md justify-between p-2">
            <RouterLink :to="`/dashboard/courses/${$route.params.id}/topics/${element.id}`" class="flex items-center space-x-5">
              <component :is="IconMap[level.levelType]" class="w-5 h-5 text-gray-600" />
              <div>
                <h4 class="font-semibold">{{ level.name }}</h4>
                <p class="text-sm text-gray-500">XP: {{ level.xp }}</p>
              </div>
            </RouterLink>
          </li>
        </ul>
      </template>
      <div v-else>
        <p>No Levels Available</p>
      </div>
       </tempalte>
      
      <Button
        @click="() => $router.push(`/dashboard/courses/${$route.params.id}/topics/${element.id}/new-level`)"
        class="mx-auto my-3 block max-w-fit"
        >Add New Level</Button
      >
    </template>
  </div>
</template>
