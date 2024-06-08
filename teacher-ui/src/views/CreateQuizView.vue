<script lang="ts" setup>
import {  UploadCloudIcon, ChevronLeft } from 'lucide-vue-next'
import {Button} from "@/components/ui/button"
import MatchingPairs from "@/components/quiz/MatchingPairs.vue"
import {ref, watch} from "vue"
type QuizType =  "MULTIPLE CHOICE"|
  "COMPLETE SEQUENCE" |
  "MATCHING PAIRS"
const options: QuizType[] = [
    "MULTIPLE CHOICE",
  "COMPLETE SEQUENCE",
  "MATCHING PAIRS"
  ];
  const currentQuiz = ref<QuizType>('MATCHING PAIRS')
 const pairs = ref('');
watch(currentQuiz, () => {
    pairs.value = ''
})
const handleUpdatePairs = (updatedPairs: string) => {
  pairs.value = updatedPairs;
};
</script>
<template>
    <header class="flex h-16 px-4 py-3 items-center justify-between">
        <div class="flex items-center gap-4">
            <Button variant="secondary" class="bg-slate-300" size="icon">
                <ChevronLeft/>
                <span class="sr-only">go back</span>
            </Button>
            <select class="border border-gray-300 px-3 h-10" v-model="currentQuiz">
                <option v-for="option in options" :key="option" :value="option" >
                {{option}}
                </option>
            </select>
        </div>
        <div class="">
            <h1 class="text-2xl font-semibold text-center">New Quiz</h1>
        </div>
       
        <div>
            <Button class="gap-x-1.5"> <UploadCloudIcon :size="18" /> Publish</Button>
        </div>
    </header>
    <section>
        <template v-if="currentQuiz === 'MATCHING PAIRS' " >
            <div class="mb-12 mt-7 text-center w-[90%] mx-auto">
                <h2 class="text-xl mb-2 text-center font-medium">Matching Pairs</h2>
                <p class="text-sm opacity-80 w-[80%] mx-auto">use the form below to create a matching pairs quiz, (when done click publish)</p>
            </div>
        <MatchingPairs @update:pairs="handleUpdatePairs"/>
        </template>
    </section>
</template>