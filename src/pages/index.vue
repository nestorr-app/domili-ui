<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'Domili',
})
</script>

<template>
  <MainLayout theme="default">
    <RouterView v-slot="{ Component }">
      <Transition name="fade-fast" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </MainLayout>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
</style>
