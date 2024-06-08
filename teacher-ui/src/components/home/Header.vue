<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {PenIcon, PlusIcon} from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
</script>
<template>
  <header class="flex items-center justify-between mb-6 py-6 h-12 w-full px-4">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <div class="flex items-center gap-4">
      <Button size="sm">
        <PlusIcon class="w-4 h-4 mr-2" />
        Create Course
      </Button>
      <Button variant="secondary" size="sm">
        <PenIcon class="w-4 h-4 mr-2" />
        Contribute
      </Button>
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
    </div>
  </header>
</template>
