<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RouterLink, useRouter } from 'vue-router'
import { type RegisterType, registerService} from "@/services/auth"
import { useMutation } from '@tanstack/vue-query'
import {type Auth, useAuthStore} from '@/stores/auth'
import {useToast} from "@/components/ui/toast"
import {ref} from "vue";
const $router = useRouter();

/* i want to control all my input fields and get their info when i submit */
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const dob = ref<Date>(new Date())
const password = ref('')
console.log(dob.value)
const {login} = useAuthStore();
const {toast} = useToast();
const {isPending, mutate} = useMutation({
  mutationFn: (userInfo: RegisterType) => registerService(userInfo),
  onSuccess: (axiosResponse) => {
    const { name, profileId, userId, token} = axiosResponse.data.data as Auth;
    login({name, profileId, userId, token, profile_photo: undefined});
    $router.push('/dashboard');
  },
  onError: (error) => {
    console.error(error);
    toast({
      title: "sign up failed",
      description: "this likely due to a server error!",
      variant: "destructive"
    })
  }
})
function handleSubmit() {

  const userInfo: RegisterType = {
    name: `${firstName.value} ${lastName.value}`,
    email: email.value,
    dob:  new Date(dob.value),
    password: password.value,
    certificate: 'welcomeToProgramming.pdf',
  };
  console.log(userInfo)
   mutate(userInfo);
}
</script>

<template>
  <Card class="mx-auto max-w-md my-10">
    <img
      class="mx-auto size-[300px] object-contain rounded-md"
      src="@/assets/register.jpg"
      alt="a 2d illustration of a lady holding a key and typing her password credentials with a man holding a golden padlock to her left."
    />
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
      <CardDescription> Enter your information to create an account </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <label for="first-name">First name</label>
            <Input id="first-name" placeholder="Max" required v-model="firstName"/>
          </div>
          <div class="grid gap-2">
            <label for="last-name">Last name</label>
            <Input id="last-name" placeholder="Robinson" required v-model="lastName" />
          </div>
        </div>
        <div class="grid gap-2">
          <label for="email">Email</label>
          <Input id="email" type="email" placeholder="m@example.com" required v-model="email" />
        </div>
        <div class="grid gap-2">
          <label for="dob">Date of Birth</label>
          <input type="date" id="dob" required v-model="dob" class="border p-2 rounded-md" />
        </div>
        <div class="grid gap-2">
          <label for="password">Password</label>
          <Input id="password" type="password" placeholder="*******" v-model="password" />
        </div>
        <Button type="submit" class="w-full" @click="handleSubmit" :disabled="isPending"> 
         <template v-if='!isPending'>
          Create an account
        </template>
        <template v-else>
          Loading...
        </template>  
        </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <RouterLink to="/" class="underline"> Sign in </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
