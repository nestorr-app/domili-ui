<script lang="ts" setup>
import _ from 'lodash'
import dayjs from 'dayjs'
import { useBook } from '/@src/stores/book'
import { useUserSession } from '/@src/stores/userSession';

const props = defineProps({
  bookUuid: {
    type: String,
    default: null,
  },
})

const slots = useSlots()

const route = useRoute()
const userSession = useUserSession()
const book = useBook()

const isLoadingBook = ref(true)
const isLoadingMessages = ref(true)
const isSendingMessage = ref(false)
const newMessage = ref(``)
const hasBeforeSlot = computed({
  get: (): any => !!slots.before,
  set() {},
})
const currentUser = computed({
  get: (): any => userSession.user || {},
  set() {},
})
const currentBook = computed({
  get: (): any => book.book,
  set() {},
})
const currentClient = computed({
  get: (): any => currentBook.value?.client || {},
  set() {},
})
const currentMaker = computed({
  get: (): any => {
    if (!currentBook.value?.maker) return {}
    return {
      ...currentBook.value.maker,
      initials: `${currentBook.value.maker.firstname.charAt(0)}${currentBook.value.maker.lastname.charAt(0)}`.toUpperCase(),
    }
  },
  set() {},
})
const messages = computed({
  get: (): any => {
    const messages = (book?.messages || []).map((message) => ({
      ...message,
      htmlMessage: message.message.replace(/[\r\n]/g, `<br />`),
      // formattedDate: dayjs(message.createdAt).format(`[Le] DD/MM/YYYY [à] HH:mm`),
      formattedDate: dayjs(message.createdAt).format(`DD/MM/YYYY HH:mm`),
      user: {
        ...message.user,
        initials: `${message.user.firstname.charAt(0)}${message.user.lastname.charAt(0)}`.toUpperCase(),
      },
    }))
    return _.orderBy(messages, [`createdAt`], [`asc`])
  },
  set() {},
})
const newMessageNbRows = computed({
  get: (): any => {
    const nbRealRows = newMessage.value.split(/[\n\r]/g).length
    return Math.min(Math.max(nbRealRows, 3), 15)
  },
  set() {},
})
const canSendNewMessage = computed({
  get: (): any => {
    const chars = _.chain(newMessage.value)
      .replace(/[\n\r]/g, ``)
      .replace(/ +/g, ` `)
      .trim()
      .value()
    return chars.length > 1
  },
  set() {},
})

function $scrollToLastMessage() {
  setTimeout(() => {
    const scrollableContentElement = document.getElementById(`book-content-scrollable`)
    scrollableContentElement?.scrollTo(0, scrollableContentElement?.scrollHeight)
  }, 10)
}

function scrollToLastMessage(now: Boolean = false) {
  if (now) {
    return $scrollToLastMessage()
  }

  setTimeout(() => {
    $scrollToLastMessage()
  }, 10)
}

async function sendMessage() {
  isSendingMessage.value = true
  const message = await book.sendMessageInBook(route.params.bookUuid, newMessage.value)

  if (message) {
    newMessage.value = ``
  }

  scrollToLastMessage()
  isSendingMessage.value = false
}

async function loadBook() {
  isLoadingBook.value = true

  await book.loadBook(route.params.bookUuid)

  isLoadingBook.value = false
}

async function loadMessages() {
  isLoadingMessages.value = true

  await book.loadMessagesForBook(props.bookUuid || route.params.bookUuid)

  scrollToLastMessage()
  isLoadingMessages.value = false
}

onBeforeMount(async () => {
  loadBook()
  loadMessages()
})

watch(newMessageNbRows, () => {
  scrollToLastMessage(true)
})
</script>

<template>
  <div class="book-page is-navbar-lg">
    <div v-if="hasBeforeSlot" class="book-page-before">
      <slot name="before" />
    </div>
    <div class="book-page-content">
      <VLoader v-if="isLoadingBook" size="large" :active="true" grey>
        <div style="height: 100px">&nbsp;</div>
      </VLoader>
      <div v-else class="book-details">
        <div class="book-col-left">
          <div class="book-details-card">
            <div class="book-details-card-header">
              <h3>Messages du carnet de liaison</h3>
              <!-- <div class="card-head">
                <div class="title-wrap">
                  <h3>Messages du carnet de liaison</h3>
                </div>
              </div> -->

              <div class="book-overview">
                <p>
                  Retrouvez ici tous les messages de ce carnet de liaison ici et
                  ajoutez-en afin de communiquer
                </p>
              </div>
            </div>
            <div id="book-content-scrollable" class="book-details-card-content">
              <VLoader v-if="isLoadingMessages" size="large" :active="true" translucent>
                <div style="height: 100px">&nbsp;</div>
              </VLoader>
              <VFlex
                v-else-if="!messages.length"
                flex-direction="column"
                justify-content="center"
                align-items="center"
                class="book-empty"
              >
                <img src="/@src/assets/empty-book.svg" alt="Carnet vide" />
                <h1>Ce carnet est encore vide</h1>
                <h2>Écrivez le premier message</h2>
              </VFlex>
              <div v-else class="book-messages">
                <div
                  v-for="(message, i) in messages"
                  :key="message.id"
                  class="book-message"
                  :class="{
                    'is-sender-current-user': message.userId === currentUser.id,
                    'is-same-sender': i > 0 && messages[i - 1].userId === message.userId,
                  }"
                >
                  <VFlex align-items="center" class="book-message-header">
                    <VAvatar
                      :initials="message.user.initials"
                      size="small"
                      color="h-blue"
                    />
                    <div class="book-message-sender-name">
                      {{ message.user.firstname }} {{ message.user.lastname }}
                    </div>
                    <!-- <div class="book-message-sender">
                      <div class="book-message-sender-name">
                        {{ message.user.firstname }} {{ message.user.lastname }}
                      </div>
                      <div class="book-message-sender-datetime">
                        {{ message.formattedDate }}
                      </div>
                    </div> -->
                  </VFlex>
                  <VFlex class="book-message-content-wrapper">
                    <div class="book-message-content" v-html="message.htmlMessage"></div>
                  </VFlex>
                  <div class="book-message-sender-datetime">
                    {{ message.formattedDate }}
                  </div>
                </div>
                <!-- <div v-for="message in messages" :key="message.id" class="book-message">
                  <VBlock
                    center
                    :title="`${message.user.firstname} ${message.user.lastname}`"
                    :subtitle="message.formattedDate"
                    class="m-b-5"
                  >
                    <template #icon>
                      <VAvatar
                        :initials="message.user.initials"
                        size="small"
                        color="h-blue"
                      />
                    </template>
                  </VBlock>
                  <div class="book-message-content">{{ message.message }}</div>
                </div> -->
              </div>
            </div>
            <div class="book-details-new-message">
              <VFlex justify-content="start" align-items="center">
                <!-- <VAvatar :initials="currentUser.initials" size="small" /> -->
                <VFlexItem flex-grow="1" class="m-r-15">
                  <VField textaddon>
                    <VControl>
                      <VTextarea
                        v-model="newMessage"
                        :rows="newMessageNbRows"
                        :disabled="isSendingMessage"
                        placeholder="Laisser un nouveau message dans ce carnet..."
                      ></VTextarea>
                    </VControl>
                  </VField>
                </VFlexItem>
                <VIconButton
                  color="primary"
                  :disabled="!canSendNewMessage"
                  :loading="isSendingMessage"
                  circle
                  icon="feather:send"
                  @click="sendMessage"
                />
              </VFlex>
            </div>
          </div>
        </div>

        <div class="book-col-right">
          <div class="side-card">
            <VFlex justify-content="start" align-items="center" class="m-b-10">
              <VIconBox size="small" color="blue" rounded>
                <i
                  class="fas"
                  :class="`fa-${currentBook.service.icon}`"
                  aria-hidden="true"
                ></i>
              </VIconBox>
              <h4 class="title m-l-5">{{ currentBook.label }}</h4>
            </VFlex>
            <VFlex justify-content="start" align-items="center" class="m-b-10">
              <VAvatar :initials="currentMaker.initials" size="small" color="h-blue" />
              <h4 class="title m-l-5">
                {{ currentMaker.firstname }} {{ currentMaker.lastname }}
              </h4>
            </VFlex>
            <VFlex justify-content="start" align-items="center">
              <VIconBox size="small" color="blue" rounded>
                <i class="iconify" data-icon="feather:users" aria-hidden="true"></i>
              </VIconBox>
              <h4 class="title m-l-5">
                {{ currentClient.label }}
              </h4>
            </VFlex>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.book-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  margin-left: 40px;
  margin-right: 40px;

  .book-page-before {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .book-page-content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
  }
}

.book-details {
  padding: 0 0 30px;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 10px;

  .book-col-left {
    width: 80%;
    position: relative;
    overflow: hidden;
  }

  .book-empty {
    height: 100%;
    img {
      width: 80%;
      max-width: 400px;
    }
    h1 {
      font-size: 2em;
      font-weight: bold;
    }
    h2 {
      font-size: 1em;
      font-weight: 400;
    }
  }

  .book-details-card {
    @include vuero-s-card;

    display: flex;
    flex-direction: column;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    min-height: 0;
    // margin-bottom: 5px;
    // min-height: 500px;

    .book-details-card-header {
      // padding: 20px 30px 0;
      flex: 1;
      flex-grow: 0;
      border-bottom: 1px solid var(--border);
      padding-bottom: 20px;

      h3 {
        display: block;
        padding: 20px 30px 0;
        font-family: var(--font-alt);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--dark-text);
        line-height: 1.2;
        transition: all 0.3s;
      }

      .book-overview {
        // padding: 20px 0;
        // border-bottom: 1px solid var(--border);
        // margin-bottom: 20px;

        p {
          padding: 20px 30px 0;
        }

        // p {
        //   max-width: 420px;
        // }
      }
    }
    .book-details-card-content {
      padding: 20px 30px;
      flex: 1 1 auto;
      overflow: auto;
    }

    // .card-head {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;

    //   .title-wrap {
    //     h3 {
    //       font-family: var(--font-alt);
    //       font-size: 1.5rem;
    //       font-weight: 700;
    //       color: var(--dark-text);
    //       line-height: 1.2;
    //       transition: all 0.3s;
    //     }
    //   }
    // }

    // .book-overview {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    //   padding: 20px 0;
    //   border-bottom: 1px solid var(--border);
    //   // margin-bottom: 20px;

    //   // p {
    //   //   max-width: 420px;
    //   // }
    // }
  }

  .book-messages {
    // margin-top: 15px;
    // .book-message:not(:first-of-type) {
    .book-message {
      &:not(:first-of-type) {
        margin-top: 30px;
      }

      // .book-message-sender {
      //   text-align: left;
      //   margin: 0 10px;
      // }

      .book-message-sender-name {
        font-weight: bold;
        margin: 0 10px;
        font-size: 1.2em;
      }

      .book-message-sender-datetime {
        color: var(--light-text);
        font-size: 0.8em;
        text-align: left;
        margin-left: 35px;
        margin-right: 0px;
      }

      .book-message-content-wrapper {
        justify-content: start;

        .book-message-content {
          background-color: #f1f2f6;
          border-radius: 0 20px 20px 20px;
          padding: 15px;
          margin: 5px 10px 0 20px;
          min-width: 125px;
          max-width: 600px;
          font-weight: 500;
        }
      }

      &.is-sender-current-user {
        .book-message-header {
          justify-content: end;
          flex-direction: row-reverse;
        }

        .book-message-sender-datetime {
          text-align: right;
          margin-left: 0px;
          margin-right: 35px;
        }

        .book-message-content-wrapper {
          justify-content: end;

          .book-message-content {
            background-color: #1982FC;
            border-radius: 20px 0 20px 20px;
            color: white;
            margin: 5px 20px 0 10px;
          }
        }
      }

      &.is-same-sender {
        margin-top: 0px;
        .book-message-header {
          display: none;
        }
      }
    }
  }

  // .book-messages {
  //   margin-top: 15px;
  //   // .book-message:not(:first-of-type) {
  //   .book-message {
  //     margin-top: 30px;

  //     .book-message-content {
  //       margin-left: 16px;
  //       border-left: 1px solid var(--border);
  //       border-bottom: 1px solid var(--border);
  //       padding: 5px 0px 15px 15px;
  //     }
  //   }
  // }

  .book-details-new-message {
    border-top: 1px solid var(--border);
    padding: 20px;
    flex: 1;
    flex-grow: 0;

    textarea {
      resize: none;
    }
  }
  // .book-message-card {
  //   margin-top: 15px;
  // }
  // .book-message {
  //   padding-top: 10px;
  //   .book-message-card-wrapper {
  //     margin-left: 32px;
  //     // .book-message-card {
  //     // }
  //   }
  // }

  .side-card {
    @include vuero-s-card;

    padding: 20px;
    margin-bottom: 1.5rem;

    h4 {
      font-family: var(--font-alt);
      font-weight: 600;
      font-size: 1rem;
      text-transform: uppercase;
    }
  }

  .book-team-card {
    @include vuero-s-card;

    padding: 40px;
    max-width: 940px;
    display: block;
    margin: 0 auto;

    .column {
      padding: 1.5rem;

      &:nth-child(odd) {
        border-right: 1px solid var(--fade-grey-dark-3);
      }

      &.has-border-bottom {
        border-bottom: 1px solid var(--fade-grey-dark-3);
      }
    }
  }

  .task-grid {
    .grid-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--dark-text);
        line-height: 1.2;
      }

      .filter {
        display: flex;
        align-items: center;
        background: var(--white);
        padding: 8px 24px;
        border-radius: 100px;

        > span {
          font-family: var(--font-alt);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--dark-text);
          margin-right: 20px;
        }

        .multiselect {
          min-width: 140px;

          .multiselect-input {
            border: none;
          }
        }
      }
    }

    .task-card {
      @include vuero-s-card;

      min-height: 200px;
      display: flex !important;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px;
      cursor: pointer;
      transition: all 0.3s; // transition-all test

      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--light-box-shadow);
      }

      .title-wrap {
        h3 {
          font-size: 1.1rem;
          font-family: var(--font-alt);
          font-weight: 600;
          color: var(--dark-text);
          line-height: 1.2;
          margin-bottom: 4px;
        }

        span {
          font-family: var(--font);
          font-size: 0.9rem;
          color: var(--light-text);
        }
      }

      .content-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          .avatar-stack {
            margin-bottom: 6px;
          }

          .attachments {
            display: flex;
            align-items: center;

            i {
              font-size: 15px;
              color: var(--light-text);
            }

            span {
              margin-left: 2px;
              font-size: 0.9rem;
              font-family: var(--font);
              color: var(--light-text);
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .book-details {
    .book-details-card {
      @include vuero-card--dark;

      .card-head {
        .title-wrap {
          h3 {
            color: var(--dark-dark-text) !important;
          }
        }
      }

      .book-features {
        border-color: var(--dark-sidebar-light-12);

        .book-feature {
          i {
            color: var(--primary);
          }

          h4 {
            color: var(--dark-dark-text);
          }
        }
      }

      .book-files {
        h4 {
          color: var(--primary);
        }

        .file-box {
          background: var(--dark-sidebar-light-3);

          &:hover,
          &:focus {
            border-color: var(--dark-sidebar-light-10);
          }

          .meta {
            span {
              &:first-child {
                color: var(--dark-dark-text);
              }
            }
          }
        }
      }
    }

    .side-card {
      @include vuero-card--dark;

      h4 {
        color: var(--primary);
      }
    }

    .book-team-card {
      @include vuero-card--dark;

      .column {
        border-color: var(--dark-sidebar-light-12);
      }
    }

    .task-grid {
      .grid-header {
        h3 {
          color: var(--dark-dark-text);
        }

        .filter {
          background: var(--dark-sidebar-light-1) !important;
          border-color: var(--dark-sidebar-light-4) !important;

          > span {
            color: var(--dark-dark-text);
          }
        }
      }

      .task-card {
        @include vuero-card--dark;

        .title-wrap {
          h3 {
            color: var(--dark-dark-text);
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .view-wrapper.has-top-nav {
    .book-page {
      margin-left: 10px;
      margin-right: 10px;
      &.is-navbar-lg {
        margin-top: 70px;
      }

      .book-details {
        padding-bottom: 10px;
      }

      .book-overview {
        display: none;
      }
    }
  }
}

@media only screen and (max-width: 1024px) {
  .book-details {
    display: flex;
    flex-direction: column;
    margin-top: 0;

    .book-col-left {
      flex: 1;
      width: 100%;
    }

    .book-col-right {
      display: none;
    }

    .side-card {
      margin-bottom: 0;
    }

    .book-details-card {
      // padding: 30px;

      .book-details-card-content {
        padding-left: 10px;
        padding-right: 10px;
        // flex-direction: column;
        // padding: 10px 0 0;

        // p {
        //   margin-bottom: 20px;
        // }
      }

      .book-features {
        flex-wrap: wrap;

        .book-feature {
          width: calc(50% - 20px);
          text-align: center;
          margin: 0 10px;

          &:first-child,
          &:nth-child(2) {
            margin-bottom: 20px;
          }
        }
      }
    }

    .book-team-card {
      padding: 30px;

      .column {
        border-right: none !important;
      }
    }
  }
}
</style>
