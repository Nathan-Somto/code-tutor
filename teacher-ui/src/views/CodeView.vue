<template>
    <header class="flex h-16 px-4 py-3 items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="secondary" class="bg-slate-300" size="icon">
          <ChevronLeft />
          <span class="sr-only">go back</span>
        </Button>
        <select class="border border-gray-300 px-3 h-10" v-model="currentFile">
          <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <div>
        <h1 class="text-2xl font-semibold text-center">New Code Exercise</h1>
      </div>
      <div>
        <GamificationRules :initial-difficulty="'Medium'" :level-type="'Code'" :data="data" />
      </div>
    </header>
    <section class="flex flex-col gap-8 p-4 w-[90%] mx-auto">
      <div v-if="currentFile === 'starter-code'" class="h-[400px] border-2 border-slate-300 rounded-lg">
        <vue-monaco-editor
          v-model:value="code"
          theme="vs"
          :options="MONACO_EDITOR_OPTIONS"
          @mount="handleMount"
          defaultLanguage="python"
        />
      </div>
      <div v-else-if="currentFile === 'starter-file'">
        <div >
          <MdEditor v-model="starterFile" language="en-Us" class="h-[400px] border-2 border-slate-300 rounded-lg " codeTheme="github" />
        </div>
      </div>
      <div class="mt-5">
        <h3 class="text-lg font-medium mb-2">Test Cases</h3>
        <div class="grid grid-cols-1 gap-4">
          <div v-for="(testCase, index) in testCases" :key="index" class="border p-4 rounded-md">
            <div class="mb-2">
              <label class="block mb-1">Description</label>
              <Input v-model="testCase.description" placeholder="Enter description" class="w-full" />
            </div>
            <div class="mb-2">
              <label class="block mb-1">Input</label>
              <Input v-model="testCase.input" placeholder="Enter input" class="w-full" />
            </div>
            <div class="mb-2">
              <label class="block mb-1">Expected Output</label>
              <Input v-model="testCase.expectedOutput" placeholder="Enter expected output" class="w-full" />
            </div>
            <Button variant="outline" size="icon" :disabled="testCases.length === 1" class="bg-red-200" @click="removeTestCase(index)">
              <TrashIcon class="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" class="gap-x-1.5" @click="addTestCase">
            <PlusIcon :size="18" /> Add Test Case
          </Button>
        </div>
      </div>
      <div class="mt-4">
        <label class="block mb-2">Select Type</label>
        <select v-model="challengeType" class="border border-gray-300 px-3 h-10 mb-4">
          <option v-for="type in challengeTypes" :key="type" :value="type">{{ type }}</option>
        </select>
        <div v-if="challengeType === 'ALGORITHM'">
          <label class="block mb-1">Function Name</label>
          <Input v-model="functionName" placeholder="Enter function name" class="w-full" />
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { MdEditor } from 'md-editor-v3'
  import 'md-editor-v3/lib/style.css'
  import { ref, shallowRef, computed } from 'vue'
  import { type MonacoEditor, type EditorProps } from '@guolao/vue-monaco-editor'
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { UploadCloudIcon, ChevronLeft, TrashIcon, PlusIcon } from "lucide-vue-next"
  import GamificationRules from "@/components/modals/GamificationRules.vue"
  
  const langs = ['py', 'c++', 'java']
  const MONACO_EDITOR_OPTIONS: EditorProps["options"] = {
    automaticLayout: true,
    formatOnType: true,
    formatOnPaste: true,
  }
  
  const options = ['starter-code', 'starter-file']
  const currentFile = ref(options[0])
  const code = ref('# type starter code here')
  const editorRef = shallowRef<MonacoEditor | null>(null)
  const starterFile = ref("Type your Question Here")
  
  const testCases = ref<{ description: string; input: string; expectedOutput: string }[]>([
    { description: "", input: "", expectedOutput: "" },
  ])
  
  const challengeTypes = ['ALGORITHM', 'COMPLETE_CODE', 'FIX_THE_BUG']
  const challengeType = ref(challengeTypes[0])
  const functionName = ref("")
  
  const handleMount = (editor: MonacoEditor) => (editorRef.value = editor)
  
  function addTestCase() {
    testCases.value.push({ description: "", input: "", expectedOutput: "" })
  }
  
  function removeTestCase(index: number) {
    testCases.value.splice(index, 1)
  }
  
  const data = computed(() => ({
    starterFile: starterFile.value,
    testCases: testCases.value,
    language: langs[0],
    challengeType: challengeType.value,
    functionName: challengeType.value === 'ALGORITHM' ? functionName.value : null
  }))
  </script>
  
  <style scoped>
  /* Add any necessary custom styles here */
  </style>
  