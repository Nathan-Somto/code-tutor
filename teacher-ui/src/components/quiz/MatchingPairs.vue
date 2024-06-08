<script setup lang="ts">
import { ref, watch, defineEmits } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon, TrashIcon } from 'lucide-vue-next'
const props = defineProps<{
  initialBracket1?: string[]
  initialBracket2?: string[]
}>()
const emit = defineEmits(['update:pairs'])

const bracket1 = ref<string[]>(props?.initialBracket1 || [''])
const bracket2 = ref<string[]>(props?.initialBracket2 || [''])

watch(
  [bracket1, bracket2],
  () => {
    const pairs = bracket1.value.map((b1, index) => `${b1}:${bracket2.value[index]};`).join('')
    emit('update:pairs', pairs)
  },
  { deep: true }
)

const addBracket1 = () => {
  bracket1.value.push('')
  bracket2.value.push('')
}

const addBracket2 = () => {
  bracket1.value.push('')
  bracket2.value.push('')
}
const deleteBracket = (index: number) => {
  bracket1.value.splice(index, 1)
  bracket2.value.splice(index, 1)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-8 px-8">
    <div>
      <h3 class="text-lg mb-2 font-medium text-center">Bracket 1</h3>
      <div v-for="(_, index) in bracket1" :key="index" class="mb-4 mx-auto w-[90%] relative">
        <Input v-model="bracket1[index]" placeholder="Enter text" />
        <Button
          variant="destructive"
          @click="() => deleteBracket(index)"
          :disabled="bracket1.length === 1"
          size="icon"
          class="absolute top-0 right-0 z-2"
          ><TrashIcon :size="18"
        /></Button>
      </div>
      <div class="flex justify-center mx-auto w-[90%]">
        <Button @click="addBracket1" class="mx-auto max-w-fit gap-x-1.5"><PlusIcon />Add</Button>
      </div>
    </div>
    <div>
      <h3 class="text-lg mb-2 font-medium text-center">Bracket 2</h3>
      <div v-for="(_, index) in bracket2" :key="index" class="mb-4 mx-auto w-[90%] relative">
        <Input v-model="bracket2[index]" placeholder="Enter text" />
        <Button
          variant="destructive"
          @click="() => deleteBracket(index)"
          :disabled="bracket2.length === 1"
          size="icon"
          class="absolute top-0 right-0 z-2"
          ><TrashIcon :size="18"
        /></Button>
      </div>
      <div class="flex justify-center mx-auto w-[90%]">
        <Button @click="addBracket2" class="mx-auto max-w-fit gap-x-1.5"><PlusIcon />Add</Button>
      </div>
    </div>
  </div>
</template>
