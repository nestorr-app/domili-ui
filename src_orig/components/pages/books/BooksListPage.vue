<script lang="ts" setup>
import { useBook } from '/@src/stores/book'

const props = defineProps({
  clientUuid: {
    type: String,
    default: null,
  },
  userUuid: {
    type: String,
    default: null,
  },
})
const emit = defineEmits([`bookClicked`])

const book = useBook()

const isLoading = ref(false)

function bookClicked(book) {
  emit(`bookClicked`, book)
}

onBeforeMount(async () => {
  isLoading.value = true

  if (props.clientUuid) {
    await book.loadBooksForClient(props.clientUuid)
  } else {
    await book.loadBooksForUser()
  }

  isLoading.value = false
})
</script>

<template>
  <VLoader v-if="isLoading" size="large" :active="true" translucent>
    <div style="height: 100px">&nbsp;</div>
  </VLoader>
  <div v-else class="list-view list-view-v1">
    <div class="list-view-inner">
      <!--Item-->
      <TransitionGroup name="list-complete" tag="div">
        <div v-for="(item, key) in book.books" :key="key" class="list-view-item">
          <div class="list-view-item-inner">
            <VIconBox size="medium" color="blue" rounded>
              <i class="fas" :class="`fa-${item.service.icon}`" aria-hidden="true"></i>
            </VIconBox>
            <div class="meta-left">
              <h3>{{ item.label }}</h3>
              <span>
                <i aria-hidden="true" class="iconify m-r-5" data-icon="feather:user"></i>
                <span>{{ item.maker.firstname }} {{ item.maker.lastname }}</span>
              </span>
            </div>
            <div class="meta-right">
              <button
                class="button is-light is-circle hint--bubble hint--primary hint--top"
                data-hint="Voir details"
                @click="bookClicked(item)"
              >
                <span class="icon is-small">
                  <i
                    aria-hidden="true"
                    class="iconify"
                    data-icon="feather:arrow-right"
                  ></i>
                  <!-- <i aria-hidden="true" class="iconify" data-icon="feather:heart"></i> -->
                </span>
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>