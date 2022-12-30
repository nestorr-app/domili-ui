<script lang="ts" setup>
// import { useBook } from '/@src/stores/book'
// import sleep from '/@src/utils/sleep'

const router = useRouter()
const route = useRoute()
// const book = useBook()

// const isLoading = ref(false)

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

// onBeforeMount(async () => {
//   isLoading.value = true

//   await book.loadBooksForClient(route.params.clientUuid)

//   isLoading.value = false
// })
</script>

<template>
  <div class="account-box is-form is-footerless">
    <!-- <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']"> -->
    <div class="form-head">
      <div class="form-head-inner">
        <div class="left">
          <h3>Carnets de liaison</h3>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton color="primary" raised tabindex="0">Nouveau carnet</VButton>
          </div>
        </div>
      </div>
    </div>
    <div class="form-body">
      <BooksListPage :client-uuid="route.params.clientUuid" @book-clicked="goToBook" />
      <!-- <VLoader v-if="isLoading" size="large" :active="true" translucent>
        <div style="height: 100px">&nbsp;</div>
      </VLoader>
      <div v-else class="list-view list-view-v1">
        <div class="list-view-inner">
          <TransitionGroup name="list-complete" tag="div">
            <div v-for="(item, key) in book.books" :key="key" class="list-view-item">
              <div class="list-view-item-inner">
                <VIconBox size="medium" color="blue" rounded>
                  <i
                    class="fas"
                    :class="`fa-${item.service.icon}`"
                    aria-hidden="true"
                  ></i>
                </VIconBox>
                <div class="meta-left">
                  <h3>{{ item.label }}</h3>
                  <span>
                    <i
                      aria-hidden="true"
                      class="iconify m-r-5"
                      data-icon="feather:user"
                    ></i>
                    <span>{{ item.maker.firstname }} {{ item.maker.lastname }}</span>
                  </span>
                </div>
                <div class="meta-right">
                  <button
                    class="button is-light is-circle hint--bubble hint--primary hint--top"
                    data-hint="Voir details"
                    @click="goToBook(item)"
                  >
                    <span class="icon is-small">
                      <i
                        aria-hidden="true"
                        class="iconify"
                        data-icon="feather:arrow-right"
                      ></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div> -->
    </div>
  </div>
</template>