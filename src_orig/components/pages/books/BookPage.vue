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

const route = useRoute()
const userSession = useUserSession()
const book = useBook()

const isLoadingBook = ref(true)
const isLoadingMessages = ref(true)
const isSendingMessage = ref(false)
const newMessage = ref(``)
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
    const messages = (book?.messages || []).map(message => ({
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
    return Math.max(nbRealRows, 3)
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

async function sendMessage() {
  isSendingMessage.value = true
  const message = await book.sendMessageInBook(route.params.bookUuid, newMessage.value)

  if (message) {
    newMessage.value = ``
  }

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

  isLoadingMessages.value = false
}

onBeforeMount(async () => {
  loadBook()
  loadMessages()
})
</script>

<template>
  <VLoader v-if="isLoadingBook" size="large" :active="true" grey>
    <div style="height: 100px">&nbsp;</div>
  </VLoader>
  <div v-else class="book-details">
    <div class="columns book-details-inner">
      <div class="column is-8">
        <div class="book-details-card">
          <div class="book-details-card-content">
            <div class="card-head">
              <div class="title-wrap">
                <h3>Messages du carnet de liaison</h3>
              </div>
            </div>

            <div class="book-overview">
              <p>
                Retrouvez ici tous les messages de ce carnet de liaison ici et ajoutez-en
                afin de communiquer
              </p>
            </div>
            <VLoader v-if="isLoadingMessages" size="large" :active="true" translucent>
              <div style="height: 100px">&nbsp;</div>
            </VLoader>
            <div v-else class="book-messages">
              <div
                v-for="message in messages"
                :key="message.id"
                class="book-message"
                :class="{
                  'is-sender-current-user': message.userId === currentUser.id,
                }"
              >
                <VFlex align-items="center" class="book-message-header">
                  <VAvatar
                    :initials="message.user.initials"
                    size="small"
                    color="h-blue"
                  />
                  <div class="book-message-sender">
                    <div class="book-message-sender-name">
                      {{ message.user.firstname }} {{ message.user.lastname }}
                    </div>
                    <div class="book-message-sender-datetime">
                      {{ message.formattedDate }}
                    </div>
                  </div>
                </VFlex>
                <VFlex class="book-message-content-wrapper">
                  <div class="book-message-content" v-html="message.htmlMessage"></div>
                </VFlex>
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

      <div class="column is-4">
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
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.book-details {
  .book-details-inner {
    padding: 0 0 20px;

    .book-details-card {
      @include vuero-s-card;

      padding: 0;
      margin-bottom: 5px;
      // min-height: 500px;

      .book-details-card-content {
        padding: 20px 30px;
      }

      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title-wrap {
          h3 {
            font-family: var(--font-alt);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--dark-text);
            line-height: 1.2;
            transition: all 0.3s; // transition-all test
          }
        }
      }

      .book-overview {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0;
        border-bottom: 1px solid var(--border);
        margin-bottom: 20px;

        // p {
        //   max-width: 420px;
        // }
      }
    }

    .book-messages {
      margin-top: 15px;
      // .book-message:not(:first-of-type) {
      .book-message {
        margin-top: 30px;

        .book-message-sender {
          text-align: left;
          margin: 0 10px;
        }

        .book-message-sender-name {
          font-weight: bold;
          // margin: 0 10px;
        }

        .book-message-sender-datetime {
          color: var(--light-text);
          font-size: 0.8em;
          margin-top: -3px;
        }

        .book-message-content-wrapper {
          justify-content: start;

          .book-message-content {
            background-color: #f1f2f6;
            border-radius: 0 20px 20px 20px;
            padding: 15px;
            margin: 8px 0 0 20px;
            // width: 80%;
            max-width: 600px;
            font-weight: 500;
          }
        }

        &.is-sender-current-user {
          .book-message-header {
            justify-content: end;
            flex-direction: row-reverse;
          }

          .book-message-sender {
            text-align: right;
          }

          .book-message-content-wrapper {
            justify-content: end;

            .book-message-content {
              background-color: #1982FC;
              border-radius: 20px 0 20px 20px;
              color: white;
              margin: 5px 20px 0 0;
            }
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
      margin-top: 20px;
      padding: 20px;

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
}

.is-dark {
  .book-details {
    .book-details-inner {
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
}

@media only screen and (max-width: 1024px) {
  .book-details {
    .book-details-inner {
      display: flex;
      flex-direction: column-reverse;
      margin-top: 0;

      .side-card {
        margin-bottom: 0;
      }

      .book-details-card {
        // padding: 30px;

        .book-overview {
          // flex-direction: column;
          padding: 10px 0 0;

          p {
            margin-bottom: 20px;
          }
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
}

// @media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
//   .book-details {
//     .book-details-inner {
//       .book-details-card {
//         .book-files {
//           .columns {
//             display: flex;

//             .column {
//               min-width: 50%;
//             }
//           }
//         }
//       }

//       .book-team-card {
//         .columns {
//           display: flex;

//           .column {
//             min-width: 50%;
//           }
//         }
//       }

//       .task-grid {
//         .columns {
//           display: flex;

//           .column {
//             min-width: 50%;
//           }
//         }
//       }
//     }
//   }
// }
</style>
