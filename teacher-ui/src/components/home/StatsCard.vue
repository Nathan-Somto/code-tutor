<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
defineProps<{
  title: string
  value: number
}>()
</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="text-4xl font-bold">{{ value }}</div>
    </CardContent>
  </Card>
</template>
