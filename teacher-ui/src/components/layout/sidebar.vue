<script setup lang="ts">
import {RouterLink} from "vue-router";
import {data} from './sidebarData';
const navData = data('1234')
</script>
<template>
   <div class="bg-gray-900 text-white lg:fixed top-0 left-0 z-[50] w-[250px] h-screen flex flex-col gap-4 p-4 md:p-6 lg:p-8">
        <RouterLink to="#" className="flex items-center gap-2">
          <span class='py-3  tracking-tighter text-2xl  font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-indigo-500 to-purple-500'>Code Tutor</span>
        </RouterLink>
    <nav className="flex flex-col gap-2">
          <template v-for="{text, icon: Icon, link} in navData" :key='text'>
            <RouterLink :to='link' class='flex items-center gap-2 hover:bg-gray-800 px-3 py-2 rounded-md'>
              <component :is="Icon"/>
              <span> {{text}} </span>
            </RouterLink>
        </template>
        </nav>
      </div>
</template>

