<script lang="ts" setup>
import { useClient } from '/@src/stores/client'

const router = useRouter()
const route = useRoute()
const client = useClient()

function goToClient() {
  router.push({
    name: `/company/[companyUuid]/clients/[clientUuid]/books/`,
    params: {
      companyUuid: route.params.companyUuid,
      clientUuid: route.params.clientUuid,
    },
  })
}
</script>

<template>
  <div class="book-page-header">
    <VFlex justify-content="space-between" align-items="center">
      <VButton
        icon="lnir lnir-arrow-left rem-100"
        rounded
        outlined
        @click="goToClient"
      >
        Retour fiche client
      </VButton>
      <VFlex align-items="center">
        <i class="iconify" data-icon="feather:users" aria-hidden="true"></i>
        <h3 class="title is-5 m-l-5">
          {{ client.client.label }}
        </h3>
      </VFlex>
    </VFlex>
  </div>
  <div class="book-page-container">
    <BookPage />
  </div>
</template>

<style lang="scss" scoped>
.book-page-header {
  border-bottom: 1px solid var(--border);
  height: 50px;

  h3 {
    margin-bottom: 0;
  }
}
.book-page-container {
  margin-top: 20px;
}
</style>
