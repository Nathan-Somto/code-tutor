<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {ChevronLeft} from 'lucide-vue-next';
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
  $router.push('/dashboard');
};
</script>
<template>
    <div
      class="h-screen flex w-full"
    >
      <div class=" sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 mx-auto self-center">
        <Button class="fixed top-0 left-0 my-2 ml-2 " size='icon' @click="() => $router.push('/home')">
        <ChevronLeft/>
        </Button>
        <Card class="w-full max-w-sm mx-auto py-3">
        <div
          class="hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center"
        >
          <img
            src="@/assets/authentication.png"
            alt="login"
            class="mx-auto"
          />
        </div>
    <CardHeader>
      <CardTitle class="text-2xl">
        Login
      </CardTitle>
      <CardDescription>
        Enter your email below to login to your account.
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div class="grid gap-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" required placeholder='******' />
      </div>
    </CardContent>
    <CardFooter>
      <Button class="w-full" @click='login'>
        Sign in
      </Button>
    </CardFooter>
    <div class="mt-2 text-center text-sm">
        Don't have an account?
        <RouterLink to="/register" class="underline opacity-80">
          Sign up
        </RouterLink>
    </div>
  </Card>
   </div>
  </div>
  </template>