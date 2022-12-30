<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue'
import { useCompany } from '@/stores/company'

const route = useRoute()
const company = useCompany()

const isLoadingCompany = ref(true)

onBeforeMount(async () => {
  isLoadingCompany.value = true

  await company.loadCompany(route.params.companyUuid)

  isLoadingCompany.value = false
})
</script>

<template>
  <MainLayout><RouterView v-if="!isLoadingCompany" /></MainLayout>
</template>