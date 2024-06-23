<script setup lang="ts">
import { ref, computed, defineProps, watch } from 'vue'
import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloudIcon } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { createChallengeService, createLevelService, type CreateChallengeType, type CreateLevelType } from '@/services/level'
import { useToast } from '../ui/toast'
import { displayError } from '@/lib/displayError'
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
  Quiz = 90,
  Code = 150
}

export type DifficultyKeys = keyof typeof Difficulty

const { data, initialDifficulty, levelType, onSuccess } = defineProps<{
  initialDifficulty: keyof typeof Difficulty
  levelType: keyof typeof LevelType
  data: Record<string, unknown>
  onSuccess?: () => void
}>()

const name = ref('')
const xp = ref(0)
const gems = ref(5)
const mysteryLevel = ref(false)
const difficulty = ref(initialDifficulty)
const open = ref(false)
const maxXP = computed(() => LevelType[levelType])
const maxGems = 50
const difficultyOption: DifficultyKeys[] = ['Easy', 'Medium', 'Hard', 'Advanced', 'Expert']
const xpRange = computed(() => {
  const multiplier = Difficulty[difficulty.value]
  return [Math.floor(maxXP.value * multiplier), maxXP.value]
})

const gemRange = computed(() => {
  const multiplier = Difficulty[difficulty.value]
  return [Math.floor(5 + (maxGems - 5) * multiplier), maxGems]
})

const queryClient = useQueryClient()
const { toast } = useToast()
const {  isPending: isPending1, mutateAsync: createLevel } = useMutation({
  mutationFn: (newLevel: CreateLevelType) =>
    createLevelService($route.params.id as string, $route.params.topicId as string, newLevel),
})
const {isPending: isPending2, mutateAsync: createChallenge} = useMutation({
  mutationFn: (newChallenge: CreateChallengeType) =>
    createChallengeService($route.params.id as string, $route.params.topicId as string, newChallenge),
})
watch(difficulty, (newValue) => {
  const difficultyMultiplier = Difficulty[newValue]
  xp.value = Math.floor(maxXP.value * difficultyMultiplier)
  gems.value = Math.floor(5 + (maxGems - 5) * difficultyMultiplier)
})

function updateOpen(newValue: boolean) {
  open.value = newValue
}

async function onSubmit() {
  try{
    console.log(data)
  const newLevel: CreateLevelType = {
    xp: xp.value,
    mysteryLevel: mysteryLevel.value,
    difficulty: difficulty.value,
    gems: gems.value,
    name: name.value,
    levelType,
    topicId: $route.params.topicId as string
  }
  console.log(newLevel)
  let response = await createLevel(newLevel)
  let challengeData: CreateChallengeType = {
    ...data,
    levelId: response.data?.body?.id ?? '' as string,
    levelType
  }
  console.log("the challenge data: ", challengeData)
   await createChallenge(challengeData)
    open.value = false
  queryClient.invalidateQueries({ queryKey: ['course'] })
  if (onSuccess) {
    onSuccess()
  }
  $router.push(`/dashboard/courses/${$route.params.id}`)
  }catch(err){
    console.error(err)
    displayError(toast, err, 'failed to publish level!')
  }
  
}
</script>

<template>
  <Dialog :open="open" @update:open="(newValue) => updateOpen(newValue)">
    <DialogTrigger asChild>
      <Button variant="outline" class="gap-x-1.5"> <UploadCloudIcon :size="18" /> Publish </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="text-2xl font-semibold">Gamification Rules</DialogHeader>
      <DialogDescription>Set the rules for the gamification of this level.</DialogDescription>
      <div class="mb-4">
        <label for="name" class="block mb-2">Name</label>
        <Input type="string" id="name" v-model="name" class="w-full" />
      </div>
      <div class="mb-4">
        <label for="xp" class="block mb-2">
          Experience Points (XP) - Allowed range: {{ xpRange[0] }} - {{ xpRange[1] }}
        </label>
        <Input
          type="number"
          id="xp"
          v-model="xp"
          :max="maxXP"
          :min="xpRange[0]"
          class="w-full"
          :readonly="difficulty === 'Expert'"
        />
      </div>
      <div class="mb-4">
        <label for="gems" class="block mb-2">
          Gems - Allowed range: {{ gemRange[0] }} - {{ gemRange[1] }}
        </label>
        <Input
          type="number"
          id="gems"
          v-model="gems"
          :max="maxGems"
          :min="gemRange[0]"
          class="w-full"
          :readonly="difficulty === 'Expert'"
        />
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
          <option v-for="(value, index) in difficultyOption" :key="value + index" :value="value">
            {{ value }}
          </option>
        </select>
      </div>
      <Button @click="onSubmit" class="w-full" :disabled="isPending1 || isPending2">
        <template v-if="isPending1 || isPending2">Submitting...</template>
        <template v-else>Submit</template>
      </Button>
    </DialogContent>
  </Dialog>
</template>
