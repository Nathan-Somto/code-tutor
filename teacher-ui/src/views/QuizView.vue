<script setup lang="ts">
import GamificationRules from "@/components/modals/GamificationRules.vue"
import { useQuizStore } from '@/stores/quiz'
import { Button } from "@/components/ui/button"
import { ChevronLeft,PlusIcon } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
const quizStore = useQuizStore()
const $router = useRouter()
const $route = useRoute()
const handleAddClick = () => {
    $router.push(`/dashboard/courses/${$route.params.id}/topics/${$route.params.topicId}/levels/create-quiz`)
}
</script>
<template>
    <header class="flex h-16 px-4 py-3 items-center justify-between">
        <div class="flex items-center gap-4">
            <Button variant="secondary" class="bg-slate-300" size="icon">
            <ChevronLeft />
            <span class="sr-only">go back</span>
          </Button>
          <h1 class="text-2xl font-semibold">Quizzes</h1>
        </div>
        <GamificationRules
            initialDifficulty="Medium"
            levelType="Quiz"
           :data="{quizzes: quizStore.quizzes}"
        />
    </header>
<div class="p-4 mt-2">
    <div v-if="quizStore.quizzes.length > 0" class="space-y-4">
      <div
        v-for="quiz in quizStore.quizzes"
        :key="quiz.question"
        class="border p-4 rounded-lg shadow-md"
      >
        <h3 v-if="quiz.quizType === 'MULTIPLE_CHOICE'" class="text-lg font-medium">
          Question: {{ quiz.question }}
        </h3>
        <p class="text-lg font-medium">Answer: {{ quiz.answer }}</p>
        <p class="text-sm text-gray-500">Type: {{ quiz.quizType.replace('_', ' ') }}</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span 
            v-for="option in quiz.options" 
            :key="option"
            class="bg-gray-200 px-2 py-1 rounded"
          >
            {{ option }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 text-lg">
      No quizzes available.
    </div>
    <div class="flex items-center justify-center">
        <Button class="mt-4" @click="handleAddClick"><PlusIcon/>Add Quiz</Button>
    </div>
    </div>
</template>