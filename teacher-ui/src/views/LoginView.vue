<script setup lang="ts">
// write all the missing code here
import { ref } from 'vue';
// import the $router stuff here
import { useRoute, useRouter } from 'vue-router';
import {RouterLink} from 'vue-router';
const $router = useRouter();
// put state for remember_me, email, password here
const remember_me = ref(false);
const email = ref('');
const password = ref('');
// create login function here
const login = () => {
  console.log('login');
};
</script>
<template>
    <div
      class="h-screen flex w-full"
      id="page-login"
    >
      <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
        <div class="back-home" v-on:click="$router.push('/home')">
        </div>
          <div slot="no-body" class="full-page-bg-color">
            <div class="">
              <div
                class="hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center"
              >
                <img
                  src="@/assets/authentication.png"
                  alt="login"
                  class="mx-auto"
                />
              </div>
              <div
                class="sm:w-full md:w-full lg:w-1/2 mx-auto self-center"
              >
                
                  
                      <input
                        name="email"
                        :label-placeholder="email"
                        v-model="email"
                        class="w-full no-icon-border"
                      />
                      <span class="text-danger text-sm">{{ undefined }}</span>
                    
                  
                      <input
                        type="password"
                        name="password"
                        :label-placeholder="password"
                        v-model="password"
                        class="w-full mt-6 no-icon-border"
                      />
                    <div class="flex flex-wrap justify-between my-5">
                      <input
                        v-model="remember_me"
                        class="mb-3"
                        type="checkbox"
                        
                      />
                        {{remember_me}}
                      
                      <RouterLink :disabled="true" to="/pages/forgot-password"
                        >Forgot Password?</RouterLink
                      >
                    </div>
                    <button
                        class=""
                       @click="login"
                      ></button>   
                </div>
              </div>
            </div>
          </div>
      </div>
  </template>