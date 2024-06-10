<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Multiselect from 'vue-multiselect'
import {useRouter} from "vue-router"
import 'vue-multiselect/dist/vue-multiselect.css'
const supportedLanguages = ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'TypeScript']
const $router = useRouter()
const props = defineProps<{
  forEdit: boolean
  initialData?: {
    title: string
    description: string
    image_url: string
    language: string
    contributors: { userId: string; name: string }[]
  }
}>()

const formData = ref({
  title: props?.initialData?.title || '',
  description: props?.initialData?.description || '',
  image_url: props?.initialData?.image_url || '',
  language: props?.initialData?.language || '',
  contributors: props?.initialData?.contributors || []
})

const availableContributors = ref([
  { userId: '1', name: 'John Doe' },
  { userId: '2', name: 'Jane Smith' },
  { userId: '3', name: 'Alice Johnson' }
])

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = () => {
      formData.value.image_url = reader.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}
console.log(formData.value.contributors);
const handleSubmit = (e: Event) => {
    e.preventDefault()
  // Handle form submission logic
  console.log('Form submitted:', formData.value.contributors)
}
</script>

<template>
  <form class=" px-8 mx-auto py-10" @submit="handleSubmit">
    <h1 class="text-3xl font-semibold mb-3 text-center">{{ props.forEdit ? 'Edit Course' : 'Create Course' }}</h1>
    <div>
      <div class="mb-4">
        <label class="block mb-1">Course Image</label>
        <input type="file" @change="handleImageChange" class="border border-slate-300 rounded p-1" />
        <img
          v-if="formData.image_url"
          :src="formData.image_url"
          alt="Course Image"
          class="mt-2 w-24 h-24 object-cover rounded"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Course Name</label>
        <Input v-model="formData.title" class="w-full" />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Course Description</label>
        <textarea
          v-model="formData.description"
          class="w-full border rounded p-2 resize-none border-slate-300"
          rows="3"
        ></textarea>
      </div>
      <div class="mb-4">
        <label class="block mb-1">Supported Programming Languages</label>
        <select v-model="formData.language" class="w-full border border-gray-300 px-3 h-10">
          <option v-for="language in supportedLanguages" :key="language" :value="language">
            {{ language }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label class="block mb-1">Contributors</label>
        <Multiselect
          v-model="formData.contributors"
          placeholder="Add Contributors"
          :multiple="true"
          label="name"
          :options="availableContributors"
           track-by="name"
           class="border-gray-300"
        />
      </div>
    </div>
  <Button  class="mt-4" type="submit">{{ props.forEdit ? 'Save' : 'Create' }}</Button>
  </form>
</template>
