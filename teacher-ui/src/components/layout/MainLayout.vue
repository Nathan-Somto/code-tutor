<script setup lang="ts">
import Sidebar from './Sidebar.vue'
</script>
<template>
    <Sidebar/>
    <main class="min-h-screen lg:ml-[250px] lg:w-[calc(100vw-250px)] w-full">
        
        <router-view></router-view>
    </main>
</template>