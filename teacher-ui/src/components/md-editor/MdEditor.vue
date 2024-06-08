<template>
  <div class="w-full mx-auto px-5">
    <MdEditor v-model="localText" language="en-Us" codeTheme="github" />
    <div class="mt-4 flex lg:flex-row gap-y-5 lg:gap-y-0 flex-col justify-between lg:items-center">
      <div class="flex items-center justify-between lg:flex-[0.7]">
        <Button @click="previousPage" :disabled="currentPage === 0">Previous</Button>
        <p>Page {{ currentPage + 1 }} of {{ pageCount }}</p>
        <Button @click="nextPage" :disabled="currentPage === pageCount - 1">Next</Button>
      </div>
      <div class="flex lg:gap-4 justify-between">
        <Button @click="addPage" class="gap-x-1.5 text-sm" size="sm" variant="secondary">
          <PlusIcon :size="18" /> Add Page</Button
        >
        <Button variant="destructive" @click="deletePage" :disabled="pageCount === 1" class="gap-x-1.5 text-sm" size="sm">
          <TrashIcon :size="18" /> Delete Page</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineProps, defineEmits } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { Button } from '@/components/ui/button'
import { PlusIcon, TrashIcon } from 'lucide-vue-next'

const props = defineProps<{
  initialPages: string[]
}>()
const emit = defineEmits(['update:pages'])
// Page Size constant
const PAGE_SIZE = 24
// Local state for the editor
const localPages = ref([...props.initialPages])
const currentPage = ref(0)
const localText = ref(localPages.value[currentPage.value])

// Watch for changes in localText and emit updates to the parent
watch(localText, (newValue) => {
  localPages.value[currentPage.value] = newValue
  emit('update:pages', [...localPages.value])
})

// Watch for changes in localText to add a new page when it exceeds 24 lines
watch(localText, (newValue) => {
  const lines = newValue.split('\n')
  if (lines.length > PAGE_SIZE) {
    const overflowText = lines.splice(24).join('\n')
    localPages.value[currentPage.value] = lines.join('\n')
    localPages.value.push(overflowText)
    currentPage.value++
    localText.value = overflowText
    emit('update:pages', [...localPages.value])
  }
})

const pageCount = computed(() => localPages.value.length)

// Navigate through pages
const nextPage = () => {
  if (currentPage.value < pageCount.value - 1) {
    currentPage.value++
    localText.value = localPages.value[currentPage.value]
  }
}

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    localText.value = localPages.value[currentPage.value]
  }
}

const addPage = () => {
  localPages.value.push('')
  currentPage.value = pageCount.value - 1
  localText.value = localPages.value[currentPage.value]
  emit('update:pages', [...localPages.value])
}
const deletePage = () => {
localPages.value.splice(currentPage.value, 1);
currentPage.value = (pageCount.value - 1) % pageCount.value;
localText.value = localPages.value[currentPage.value]
emit('update:pages', [...localPages.value])
}
</script>
