<script lang="ts" setup>
import {DialogHeader, DialogContent, Dialog} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import { type Topic} from "@/views/CourseView.vue"
import {ref, watch} from "vue"
let {addTopic, open, updateOpen} = defineProps<{
  addTopic: (topic: Topic) => void;
  open: boolean;
  updateOpen: (open: boolean) => void;
}>();
const name = ref('')
const description = ref('')
console.log(name.value)
const handleSubmit = (e: Event) => {
  e.preventDefault();
  const topic: Topic = {
    id: Math.random().toString(36).substr(2, 9),
    name:name.value,
    description: description.value
  };
  addTopic(topic);
  updateOpen(false);
  
};
watch(open, (newValue) => {
  if (!newValue) {
    name.value = ''
    description.value = ''
  }
});
</script>

<template>
  <!-- allow the x button to still change openDialog -->
    <Dialog :open="open" @update:open="(newValue) => updateOpen(newValue)" >
      <DialogContent>
          <DialogHeader class="text-2xl font-semibold">New Topic </DialogHeader>
            <form class="grid gap-4" @submit="handleSubmit">
                  <div class="grid gap-2">
                    <label htmlFor="topic-name">Topic Name</label>
                    <Input id="topic-name"  v-model="name" placeholder="Enter topic name"  />
                  </div>
                  <div class="grid gap-2">
                    <label htmlFor="topic-description">Description</label>
                    <textarea id="topic-description" v-model="description" class="h-[130px] px-2 !resize-none border rounded-md"  placeholder="Enter topic description" rows={3} />
                  </div>
                  <Button type="submit">Create Topic</Button>
                </form>
        </DialogContent>
    </Dialog>
</template>