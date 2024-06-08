<template>
  <RouterLink :to='`/dashboard/courses/${id}`'>
    <Card>
      <CardContent class="flex items-center justify-between py-2">
        <div class="flex items-center gap-4">
          <BookIcon class="w-8 h-8 text-gray-500 dark:text-gray-400" />
          <div>
            <h3 class="text-lg font-bold">{{ courseTitle }}</h3>
            <div class="text-gray-500 dark:text-gray-400">
              <span>{{ levels }} Levels</span>
              <span class="mx-2">·</span>
              <span>{{ topics }} Topics</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
          @click="() => onButtonClick(id.toString())"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  </RouterLink>
</template>

<script setup lang="ts">
import {RouterLink} from 'vue-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookIcon, ChevronRightIcon } from 'lucide-vue-next';
const { courseTitle, levels, onButtonClick, topics } = defineProps<{
  id: number
  courseTitle: string
  levels: number
  topics: number
  onButtonClick: (id: string) => void
}>()
</script>
