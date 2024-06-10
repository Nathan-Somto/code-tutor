<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {useRouter, useRoute} from "vue-router"; 
defineProps<{
  student: {
    id: string
  }
}>()
const $router = useRouter();
const $route = useRoute();
function copy(id: string) {
  navigator.clipboard.writeText(id)
}
function viewCodeSubmissions(id: string){
    $router.push(`/dashboard/courses/${$route.params.id}/code-submissions/${id}`)
}
function disableStudentAccount(id: string) {

}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="copy(student.id)">
        Copy student ID
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="viewCodeSubmissions(student.id)">View code submissions</DropdownMenuItem>
      <DropdownMenuItem class="text-red-500">Disable student account</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>