<script lang="ts" setup>
import {DialogHeader, DialogContent, Dialog} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import { type Topic} from "@/views/CourseView.vue"
import {ref, defineProps, watch} from "vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { createTopicService } from "@/services/topic"
import { useRoute } from "vue-router"
import { useToast } from "../ui/toast"
import { displayError } from "@/lib/displayError"
// Destructure props correctly if using Options API
const {open, updateOpen} = defineProps<{
  open: boolean;
  updateOpen: (open: boolean) => void;
}>();

// Assign props to local variables

const name = ref('')
const description = ref('')
const $route = useRoute()
const queryClient = useQueryClient()
watch(
  () => open,
  (newVal) => {
    console.log("Dialog open state changed:", newVal);
  }
);
const {toast} = useToast();
console.log("from dialog",open)
const {mutate, isPending} = useMutation({
  mutationFn: (topic: Omit<Topic, 'id' | 'order'>) => createTopicService($route.params.id as string, {...topic, courseId: $route.params.id as string}),
  onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['course'] })
  name.value = ''
  description.value = ''
  updateOpen(false);
  },
  onError: (err)=>{
    console.error(err)
    displayError(toast, err, 'Topic creation failed')
  }
})
console.log(name.value)
const handleSubmit = (e: Event) => {
  e.preventDefault();
  const topic: Omit<Topic, 'id' | 'order'> = {
    name:name.value,
    description: description.value
  };
  console.log(topic)
  mutate(topic)
  
};

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
                  <Button type="submit" :disabled="isPending"> 
                    <template v-if="isPending">
                      Creating...
                    </template>
                    <template v-else>
                      Create
                    </template>
                  </Button>
                </form>
        </DialogContent>
    </Dialog>
</template>