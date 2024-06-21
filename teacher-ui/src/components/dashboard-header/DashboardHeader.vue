<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {useAuthStore} from "@/stores/auth"
import { useRouter } from 'vue-router';
const props = defineProps<{title: string, showAvatar: boolean}>()
const {auth, logout} = useAuthStore();
const $router = useRouter();
function onLogout() {
    logout();
    $router.push('/login');
}
let name = (auth?.name && auth?.name.length > 1)  ?  (auth.name[0] + auth.name[1]): "AN";
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
                  <AvatarImage :src="auth?.profile_photo ?? '/placeholder.svg'" alt="@shadcn" />
                  <AvatarFallback>{{name}}</AvatarFallback>
                  <span class="sr-only">Toggle user menu</span>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>{{auth?.name ?? ''}}</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="onLogout" class="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </template>
    </div>
  </header>
</template>