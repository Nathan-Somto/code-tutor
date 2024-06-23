<script setup lang="ts">
import { MdEditor } from '@/components/md-editor'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'
import { SaveIcon, UploadCloudIcon } from 'lucide-vue-next'
import { ref, watch, reactive } from 'vue'
import GamificationRules from "@/components/modals/GamificationRules.vue"
const pages = ref(['# Page 1 Content', '# Page 2 Content'])
const data = reactive({
  content: pages.value
})

watch(pages, (newValue) => {
  data.content = newValue
})
const handlePageUpdates = (updatedPages: string[]) => {
  pages.value = updatedPages
}
function handleSave() {
  // saves the content to their local machine.
}
</script>
<template>
  <DashboardHeader title="New Lesson" showAvatar>
    <div class="flex gap-4 items-center">
      <Button variant="outline" class="gap-x-1.5"> <SaveIcon :size="18" /> Save</Button>
      <!-- Gamification side bar rules form, pass in your data to the form i.e pages  -->
      <!-- the sidebar form asks a few questions like xp, mystery level, dififculty, language. then it creates the level then redirects to the course page. -->
      <GamificationRules :initial-difficulty="'Easy'" :level-type="'Lesson'" :data="data" />
    </div>
  </DashboardHeader>
  <MdEditor :initialPages="pages" @update:pages="handlePageUpdates" />
</template>
