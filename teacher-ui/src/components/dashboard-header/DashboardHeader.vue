<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
const props = defineProps<{title: string, showAvatar: boolean}>()
</script>
<template>
    <header class="flex items-center justify-between mb-6 py-6 h-12 w-full px-4">
    <h1 class="text-2xl font-bold">{{props.title}}</h1>
    <div class="flex items-center gap-4">
        <slot/>
        <template v-if="props.showAvatar">    
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar class="h-10 w-10 border">
                  <AvatarImage src="/placeholder.svg" alt="@shadcn" />
                  <AvatarFallback>JP</AvatarFallback>
                  <span class="sr-only">Toggle user menu</span>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>My Account</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </template>
    </div>
  </header>
</template>