<template>
    <div>
      <Button @click="openDialog">Open Dialog</Button>
      <Dialog :open="isOpen" @update:open="handleDialogUpdate">
        <DialogContent>
          <DialogHeader class="text-2xl font-semibold">Test Dialog</DialogHeader>
          <p>This is a test dialog to check programmatic opening.</p>
          <Button @click="closeDialog">Close Dialog</Button>
        </DialogContent>
      </Dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  
  const isOpen = ref(false);
  
  const openDialog = () => {
    isOpen.value = true;
  };
  
  const closeDialog = () => {
    isOpen.value = false;
  };
  
  const handleDialogUpdate = (newValue: boolean) => {
    isOpen.value = newValue;
  };
  </script>
  