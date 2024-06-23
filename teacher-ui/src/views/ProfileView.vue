<script setup lang="ts">
import DashboardHeader from '@/components/dashboard-header/DashboardHeader.vue';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Card, CardContent, CardHeader} from '@/components/ui/card'
</script>
<template>
    <DashboardHeader
    show-avatar
    title="Profile"
    />
    <Card class="max-w-lg py-3  min-h-48 rounded-md border-slate-300 ml-6 px-2 border-2">
        <CardContent class="flex items-center gap-x-5 ">
            <Avatar class="size-32 border-slate-400 text-lg">
            <AvatarFallback class="">
                NA
            </AvatarFallback>
            <AvatarImage src="https://example.com" alt="avatar image"/>
            </Avatar>
            <div class="">
                <div class="flex gap-x-2 items-center">
                    <p class="font-medium">Name: </p>
                    <p class="opacity-80">Mkparu Somtochi</p>
                </div>
                <div class="flex gap-x-2 items-center">
                    <p class="font-medium">Email: </p>
                    <p class="opacity-80">mkparusomtochi26@gmail.com</p>
                </div>
                <div class="flex gap-x-2 items-center">
                    <p class="font-medium">Joined at: </p>
                    <p class="opacity-80">12th, June 2004</p>
                </div>
            </div>
        </CardContent>
    </Card>
</template>