<script lang="ts" setup>
import { SaveIcon, ChevronLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import MatchingPairs from '@/components/quiz/MatchingPairs.vue'
import MultipleChoice from '@/components/quiz/MultipleChoice.vue'
import CompleteSequence from '@/components/quiz/CompleteSequence.vue'
import { type Quiz, type QuizType, useQuizStore } from '@/stores/quiz'
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
const quizStore = useQuizStore()
const $router = useRouter()
const $route = useRoute()
type MCQ = Omit<Quiz, 'quizType'> & { question: string }
const options: QuizType[] = ['MULTIPLE_CHOICE', 'COMPLETE_SEQUENCE', 'MATCHING_PAIRS']
const currentQuiz = ref<QuizType>('MATCHING_PAIRS')
const pairs = ref('')
const mcq = ref({
  question: '',
  answer: '',
  options: ['']
})
watch(currentQuiz, () => {
  pairs.value = ''
  mcq.value = {
    question: '',
    answer: '',
    options: ['']
  }
})
const handleSave = () => {
  let data: Quiz = {
    answer: '',
    options: [],
    quizType: 'MULTIPLE_CHOICE'
  }
  let noQuiz = false
  // add the neccessary info to data
  switch (currentQuiz.value) {
    case 'MULTIPLE_CHOICE':
      data.question = mcq.value.question
      data.answer = mcq.value.answer
      data.options = mcq.value.options
      break
    case 'MATCHING_PAIRS':
      data.answer = pairs.value
      data.options = []
      data.quizType = "MATCHING_PAIRS"
      break
    default:
      noQuiz = true
      break
  }
  if (noQuiz) return
  // keep in the quiz store
  quizStore.addQuiz(data)

  // Redirect to quiz view page
  $router.push(`/dashboard/courses/${$route.params.id}/topics/${$route.params.topicId}/levels/quiz`)
}
const handleUpdatePairs = (updatedPairs: string) => {
  pairs.value = updatedPairs
}
const handleUpdateMCQ = (updatedMCQ: MCQ) => {
  mcq.value = updatedMCQ
}
</script>
<template>
  <header class="flex h-16 px-4 py-3 items-center justify-between">
    <div class="flex items-center gap-4">
      <Button variant="secondary" class="bg-slate-300" size="icon">
        <ChevronLeft />
        <span class="sr-only">go back</span>
      </Button>
      <select class="border border-gray-300 px-3 h-10" v-model="currentQuiz">
        <option v-for="option in options" :key="option" :value="option">
          {{ option.replace('_', ' ') }}
        </option>
      </select>
    </div>
    <div class="">
      <h1 class="text-2xl font-semibold text-center">New Quiz</h1>
    </div>

    <div>
      <Button variant="outline" class="gap-x-1.5" @click="handleSave">
        <SaveIcon :size="18" /> Save</Button
      >
    </div>
  </header>
  <section>
    <template v-if="currentQuiz === 'MATCHING_PAIRS'">
      <div class="mb-12 mt-7 text-center w-[90%] mx-auto">
        <h2 class="text-xl mb-2 text-center font-medium">Matching Pairs</h2>
        <p class="text-sm opacity-80 w-[80%] mx-auto">
          use the form below to create a matching pairs quiz, (when done click publish)
        </p>
      </div>
      <MatchingPairs @update:pairs="handleUpdatePairs" />
    </template>
    <template v-else-if="currentQuiz === 'MULTIPLE_CHOICE'">
      <div class="my-7 text-center w-[90%] mx-auto">
        <h2 class="text-xl mb-2 text-center font-medium">Multiple Choice</h2>
      </div>
      <MultipleChoice @update:mcq="handleUpdateMCQ" />
    </template>
    <template v-else>
      <CompleteSequence />
    </template>
  </section>
</template>
