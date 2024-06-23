<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Multiselect from 'vue-multiselect'
import {useRouter} from "vue-router"
import 'vue-multiselect/dist/vue-multiselect.css'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {type CourseType, createCourseService} from "@/services/course"
import { uploadFiles} from '@/config/uploadthing'
import { useToast} from '../ui/toast'
import { useAuthStore } from '@/stores/auth'
import { displayError } from '@/lib/displayError'
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
});
const imageFile = ref<File>()
const startedSubmission = ref<boolean>(false)
const {invalidateQueries} = useQueryClient();
const {isPending, mutate} = useMutation({
  mutationFn: (courseData: CourseType) => createCourseService(courseData),
  onSuccess: (axiosResponse) => {
    const payload = axiosResponse.data.body;
    console.log(payload);
    // revalidate dashboard query key.
    invalidateQueries({
      queryKey: ['dashboard']
    })   
    $router.push('/dashboard') 
  }  
})
const availableContributors = ref([
  { userId: '1', name: 'John Doe' },
  { userId: '2', name: 'Jane Smith' },
  { userId: '3', name: 'Alice Johnson' }
])
const {toast} = useToast();
const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    imageFile.value =input.files[0]
    reader.onload = () => {
      formData.value.image_url = reader.result as string
    }
    reader.readAsDataURL(input.files[0])
  }
}
console.log(formData.value.contributors);
const {auth} = useAuthStore();
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  startedSubmission.value = true
  try{
    if(!imageFile.value){
      toast({
        title: "Image is required",
        description: "Please upload an image for the course",
        variant: "destructive"
      })
      return;
    }
   const result = await uploadFiles('imageUploader', {
    files: [imageFile.value as File],
    skipPolling: true,
   })
  console.log("result print: ",result, result[0].url)
   let newCourse= {
    title: formData.value.title,
    description: formData.value.description,
    image_url: result[0].url,
    contributorIds: formData.value.contributors.map(c => c.userId),
    language: formData.value.language,
    creatorId: auth?.profileId as string
   }
   console.log(newCourse)
     mutate(newCourse)
  }
  catch(err){
    displayError(toast, err, "An error occurred while creating the course");
  }
  finally {
    startedSubmission.value = false
  }
   
}
// use a computed value for btn value
const btnValue = computed(() => {
  return startedSubmission.value ? 'Submitting...' : props.forEdit ? 'Update Course' : 'Create Course'
})
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
  <Button  class="mt-4" type="submit" :disabled="startedSubmission || isPending">{{ btnValue }}</Button>
  </form>
</template>
