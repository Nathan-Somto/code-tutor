<script setup lang="ts">
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { useRouter, useRoute } from 'vue-router'
import { cn } from '@/lib/utils'
import { ref } from 'vue'
import {DashboardHeader} from "@/components/dashboard-header"
const redirectLink = ref('quiz')
const $router = useRouter()
const $route = useRoute()
const redirect = () =>
  $router.push(`/dashboard/courses/${$route.params.id}/topics/${$route.params.topicId}/levels/${redirectLink.value}`)
</script>
<template>
    <DashboardHeader title="New Level" showAvatar/>
  <section class="h-screen flex flex-col items-center jutify-center">
    <h1 class="my-3 text-2xl lg:text-3xl font-bold text-center">Select the Level type</h1>
    <div class="max-w-sm mx-auto my-6">
      <RadioGroup :default-value="redirectLink" class="space-y-3" v-model="redirectLink">
        <div
          class="flex items-center space-x-5 border px-3 py-4 rounded-md hover:bg-gray-100"
          :class="cn(redirectLink === 'quiz' && 'bg-gray-100')"
        >
          <RadioGroupItem id="redirect-link" value="quiz"  />
          <div class="flex flex-col">
            <label for="redirect-link" class="font-medium">Quiz Challenge</label>
            <p class="text-xs opacity-80">
              includes quizzes such as Complete Sequence, Multiple Choice e.t.c
            </p>
          </div>
        </div>
        <div
          class="flex items-center space-x-5 border px-3 py-4 rounded-md hover:bg-gray-100 transition-all duration-250 ease-in-out"
          :class="cn(redirectLink === 'code' && 'bg-gray-100')"
        >
          <RadioGroupItem id="redirect-link" value="code" />
          <div class="flex flex-col">
            <label for="redirect-link" class="font-medium">Code Challenge</label>
            <p class="text-xs opacity-80">programming exercises with pre-defined test cases</p>
          </div>
        </div>
        <div
          class="flex items-center space-x-5 border px-3 py-4 rounded-md hover:bg-gray-100"
          :class="cn(redirectLink === 'lesson' && 'bg-gray-100')"
        >
          <RadioGroupItem id="redirect-link" value="lesson"  />
          <div class="flex flex-col">
            <label for="redirect-link" class="font-medium">Lesson</label>
            <p class="text-xs opacity-80">a brief lesson to introduce a topic.</p>
          </div>
        </div>
      </RadioGroup>
      <Button class="block max-w-fit ml-auto mt-3" @click="redirect">Proceed</Button>
    </div>
  </section>
</template>
