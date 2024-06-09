<script setup lang="ts">
import { ref, computed, defineProps, watch } from 'vue'
import { Dialog, DialogHeader, DialogDescription, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UploadCloudIcon } from "lucide-vue-next"
import { useRouter, useRoute } from "vue-router"

const $router = useRouter()
const $route = useRoute()

enum Difficulty {
  Easy = 0.25,
  Medium = 0.5,
  Hard = 0.75,
  Advanced = 0.9,
  Expert = 1
}

enum LevelType {
  Lesson = 50,
  Quiz = 75,
  Code = 100
}

const props = defineProps<{
  initialDifficulty: keyof typeof Difficulty,
  levelType: keyof typeof LevelType,
  data: Record<string, unknown>
}>()

const xp = ref(0)
const mysteryLevel = ref(false)
const difficulty = ref(props.initialDifficulty)
const maxXP = computed(() => LevelType[props.levelType])

watch(difficulty, (newValue) => {
  xp.value = Math.floor(maxXP.value * Difficulty[newValue])
})

function onSubmit() {
    console.log(props.data)
    const newLevel = {
        xp: xp.value,
        mysteryLevel: mysteryLevel.value,
        difficulty: difficulty.value
    }
  $router.push(`/dashboard/courses/${$route.params.id}`)
}
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" class="gap-x-1.5">
        <UploadCloudIcon :size="18" />Publish
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="text-2xl font-semibold">Gamification Rules</DialogHeader>
      <DialogDescription>Set the rules for the gamification of this level.</DialogDescription>
      <div class="mb-4">
        <label for="xp" class="block mb-2">Experience Points (XP)</label>
        <Input type="number" id="xp" v-model="xp" :max="maxXP" class="w-full" />
      </div>
      <div class="mb-4">
        <label class="flex items-center">
          <input type="checkbox" v-model="mysteryLevel" class="mr-2" />
          Mystery Level
        </label>
      </div>
      <div class="mb-4">
        <label for="difficulty" class="block mb-2">Difficulty</label>
        <select id="difficulty" v-model="difficulty" class="w-full p-2 border rounded">
          <option v-for="(value, key) in Difficulty" :key="key" :value="key">{{ key }}</option>
        </select>
      </div>
      <Button @click="onSubmit" class="w-full">Submit</Button>
    </DialogContent>
  </Dialog>
</template>


