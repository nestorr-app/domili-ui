<script lang="ts" setup>
const router = useRouter()
const route = useRoute()

function goToNewBook(book) {
  router.push({
    name: `/company/[companyUuid]/clients/[clientUuid]/books/new`,
    params: {
      companyUuid: route.params.companyUuid,
      clientUuid: route.params.clientUuid,
    },
  })
}

function goToBook(book) {
  router.push({
    name: `/company/[companyUuid]/clients/[clientUuid]/books/[bookUuid]`,
    params: {
      companyUuid: route.params.companyUuid,
      clientUuid: route.params.clientUuid,
      bookUuid: book.id,
    },
  })
}
</script>

<template>
  <div class="account-box is-form">
    <div class="form-head">
      <div class="form-head-inner">
        <div class="left">
          <h3>Carnets de liaison</h3>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton
              color="primary"
              raised
              tabindex="0"
              @keydown.space.prevent="goToNewBook"
              @click="goToNewBook"
            >
              Nouveau carnet
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <div class="form-body">
      <BooksListPage :client-uuid="route.params.clientUuid" @book-clicked="goToBook" />
    </div>
  </div>
</template>