<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '@/components/ui/button'

const codeBlockText = ref('##*variable ${1} "value"*##')
const dynamicVars = ref<{ placeholder: string; variableNum: number }[]>([
  { placeholder: '=', variableNum: 1 }
])
const data = ref<{ answer: string; options: string[]; question: string }>({
  answer: '##*variable="value"*##',
  options: [''],
  question: ''
})

const getCorrectSequence = () => {
  let answer = codeBlockText.value
  dynamicVars.value.forEach(({ placeholder, variableNum: value }) => {
    const regex = new RegExp(`\\${placeholder}`, 'g')
    answer = answer.replace(regex, `${value}`)
  })
  data.value.answer = answer
}

watch(codeBlockText, getCorrectSequence)
const parseCodeBlock = () => {
  const match = codeBlockText.value.match(/##\*(.*?)\*##/)
  if (!match) return []

  const content = match[1]
  // regex to split into blanks or spaces.
  const parts = content.split(/(\$\{\d+\})|\/-/)

  return parts.map((part) => {
    if (part?.startsWith('${') && part.endsWith('}')) {
      const number = +(part.match(/[0-9]+/)?.[0] || '0')
      const dynamicVar = dynamicVars.value.find((dv) => dv.variableNum === number)
      return {
        type: 'blank',
        content: dynamicVar?.placeholder ?? ' ',
        variableNum: number
      }
    } else if (part === '/-') {
      return { type: 'space', content: ' ' }
    } else {
      return { type: 'text', content: part }
    }
  })
}

const parsedCodeBlock = computed(parseCodeBlock)

const selectedText = ref('')
const showContextMenu = ref(false)
const setBlank = () => {
  const variableNum = dynamicVars.value.length + 1
  const placeholder = `\${${dynamicVars.value.length + 1}}`
  dynamicVars.value.push({ placeholder, variableNum })
  codeBlockText.value = codeBlockText.value.replace(selectedText.value, placeholder)
}

const contextMenuPosition = ref({ top: 0, left: 0 })

const handleSelection = (event: MouseEvent) => {
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    selectedText.value = selection.toString()
    showContextMenu.value = true
    contextMenuPosition.value = { top: event.clientY, left: event.clientX }
  } else {
    showContextMenu.value = false
  }
}
const updateCodeBlockText = (event: Event) => {
  const element = event.target as HTMLDivElement
  const text = element.innerText

  let newCodeBlockText = '##*'
  const words = text.replace(new RegExp('/-', 'g'), ' ').split(/(\s+)/) 
  console.log(words)
  words.forEach((word, index) => {
    const dynamicVar = dynamicVars.value.find( dv => dv.placeholder.trim() === word.trim());
    console.log(dynamicVar);
    if (dynamicVar) { 
        newCodeBlockText += `\${${dynamicVar.variableNum}}`
    } else if (word.trim() === '') {
      newCodeBlockText += '/-'
    } else {
      newCodeBlockText += word
    }
  })

  newCodeBlockText += '*##'
  console.log(newCodeBlockText)
  codeBlockText.value = newCodeBlockText
}

function oncontroldown(event: PointerEvent) {
  document?.getSelection()?.removeAllRanges()
  event.stopPropagation()
}
</script>

<template>
  <Tabs default-value="code" class="w-[600px] mx-auto">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="question"> Question </TabsTrigger>
      <TabsTrigger value="code"> Code Block </TabsTrigger>
    </TabsList>
    <TabsContent value="question" class="h-[400px]">
      <p class="my-2 opacity-80 font-medium">
        Only heading and paragraphs markdown syntax is allowed for question block.
      </p>
      <div class="relative border-2 border-slate-300 w-full rounded-lg h-[400px] p-2 shadow-md">
        <textarea
          class="w-full h-full resize-none outline-none"
          placeholder="Enter your question here"
        />
      </div>
    </TabsContent>
    <TabsContent value="code">
      <div class="relative border-2 border-slate-300 w-full rounded-lg h-[400px] p-2 shadow-md">
        <div
          @pointerup="handleSelection"
          @pointerdown="oncontroldown"
          contenteditable="true"
          @input="updateCodeBlockText"
          class="h-full outline-none"
        >
          <template v-for="(part, index) in parsedCodeBlock" :key="part.content + index">
            <template v-if="part.type === 'text'">
              <code class="text-red-500">{{ part.content }}</code>
            </template>
            <template v-else-if="part.type === 'blank'">
              <span
                class="bg-gray-200 border border-gray-400 px-2 py-1 rounded"
                contenteditable="false"
                >{{ part.content }}</span
              >
            </template>
            <template v-else-if="part.type === 'space'">
              <span class="inline-block w-2"></span>
            </template>
          </template>
        </div>
      </div>
      <div
        v-if="showContextMenu"
        role="menu"
        :style="{
          position: 'absolute',
          top: (contextMenuPosition.top + 10) + 'px',
          left: contextMenuPosition.left + 'px'
        }"
        class="!bg-slate-200 z-[50] shadow-md border-2 text-gray-700 min-h-24 rounded-md p-2 max-w-fit"
      >
        <div class="flex flex-col divide-y border-white">
          <Button @click="() => setBlank()" variant="ghost">Set as Blank</Button>
          <Button variant="ghost">Copy</Button>
          <Button variant="ghost">Cut</Button>
        </div>
      </div>
    </TabsContent>
  </Tabs>
  <p class="mt-3 font-semibold text-2xl">{{codeBlockText}}</p>
</template>
