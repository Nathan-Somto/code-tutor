<script setup lang="ts">
import {
  type DateValue
} from '@internationalized/date'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import { RouterLink, useRouter } from 'vue-router'
import {ref} from "vue";
const $router = useRouter();

/* i want to control all my input fields and get their info when i submit */
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const dob = ref<DateValue>()
const password = ref('')

function handleSubmit() {
  // Collect the input data
  const userInfo = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    dob: dob.value,
    password: password.value
  };
  console.log(userInfo);
  $router.push('/home');
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
            <Input id="first-name" placeholder="Max" required :v-model="firstName"/>
          </div>
          <div class="grid gap-2">
            <label for="last-name">Last name</label>
            <Input id="last-name" placeholder="Robinson" required :v-model="lastName" />
          </div>
        </div>
        <div class="grid gap-2">
          <label for="email">Email</label>
          <Input id="email" type="email" placeholder="m@example.com" required :v-model="email" />
        </div>
        <div class="grid gap-2">
          <label for="dob">Date of Birth</label>
          <DatePicker/>
        </div>
        <div class="grid gap-2">
          <label for="password">Password</label>
          <Input id="password" type="password" placeholder="*******" :v-model="password" />
        </div>
        <Button type="submit" class="w-full" @click="handleSubmit"> Create an account </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <RouterLink to="/" class="underline"> Sign in </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
