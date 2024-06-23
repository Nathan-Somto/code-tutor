<template>
    <!-- Markdown editor  -->
    <div class="w-[90%] mx-auto mb-6">
      <MdEditor v-model="question" language="en-Us" codeTheme="github" class="!h-[300px] !rounded-md" />
    </div>
    <!-- Options  -->
    <div class="w-[90%] mx-auto">
      <div v-for="(option, index) in options" :key="index" class="flex relative items-center mb-2">
        <Input
          v-model="options[index]"
          :class="[
            'p-2 border rounded-md flex-1 mr-2  block h-12 w-16',
            answer === index ? 'border-green-500 bg-green-100' : 'border-gray-300'
          ]"
        />
        <Button @click="selectAnswer(index)" class="mr-2" variant="ghost" size="icon">
          <CheckIcon class="w-5 h-5" :class="answer === index ? 'text-green-500' : 'text-gray-500'" />
        </Button>
        <Button @click="deleteOption(index)" :disabled="options.length === 2" variant="ghost" size="icon">
          <TrashIcon class="w-5 h-5 text-red-500" />
        </Button>
      </div>
      <Button @click="addOption" class="mt-4 flex items-center text-blue-500" variant="outline">
        <PlusIcon class="w-5 h-5 mr-2" /> Add Option
      </Button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { MdEditor } from 'md-editor-v3'
  import 'md-editor-v3/lib/style.css'
  import { CheckIcon, TrashIcon, PlusIcon } from 'lucide-vue-next'
  import { ref, watch } from 'vue'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  
  const question = ref('Type your Question Here')
  const options = ref(['Type your Option', 'Type your Option'])
  const answer = ref(0)
  const emit = defineEmits(['update:mcq'])
  
  // Watch for changes and emit the updated MCQ data
  watch([question, options, answer], () => {
    emit('update:mcq', {
      question: question.value,
      options: options.value,
      answer: options.value[answer.value]
    })
  })
  
  // Function to select an answer
  const selectAnswer = (index: number) => {
    answer.value = index;
  }
  
  // Function to delete an option
  const deleteOption = (index: number) => {
    if (options.value.length > 1) {
      options.value.splice(index, 1)
      // Update the answer if the deleted option was the selected answer
      if (answer.value === index) {
        answer.value = 0 
      }
    }
  }
  
  // Function to add a new option
  const addOption = () => {
    options.value.push('Type your Option')
  }
  </script>
  
  
  