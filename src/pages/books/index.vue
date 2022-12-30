<script lang="ts" setup>
import { useUserSession } from '/@src/stores/userSession'

const router = useRouter()
const userSession = useUserSession()

function goToBook(book: any) {
  router.push({
    name: `/books/[bookUuid]/`,
    params: {
      bookUuid: book.id,
    },
  })
}
</script>

<template>
  <BooksListPage :user-uuid="userSession.user?.id" @book-clicked="goToBook" />
</template>
