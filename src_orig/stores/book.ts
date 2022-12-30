import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composable/useApi'
import { fetchBook, fetchBooksForClient, fetchBooksForUser, fetchMessagesForBook, postMessageInBook } from '../utils/api/book'

export type BookData = Record<string, any> | null
export type BookMessageData = Record<string, any> | null

export const useBook = defineStore('book', () => {
  const api = useApi()

  const books = ref<Partial<BookData[]>>([])
  const book = ref<Partial<BookData>>()
  const messages = ref<Partial<BookMessageData[]>>([])

  function setBooks(newBooks: Partial<BookData[]>) {
    books.value = newBooks
  }

  function setBook(newBook: Partial<BookData>) {
    book.value = newBook
  }

  function setMessages(newBookMessages: Partial<BookMessageData[]>) {
    messages.value = newBookMessages
  }

  function pushNewMessage(newBookMessage: Partial<BookMessageData>) {
    messages.value.push(newBookMessage)
  }

  async function loadBooksForClient(clientId) {
    try {
      const { books } = await fetchBooksForClient(api, clientId)
      setBooks(books)
    } catch (e) {
      setBooks([])
    } finally {
      return books.value
    }
  }

  async function loadBooksForUser() {
    try {
      const { books } = await fetchBooksForUser(api)
      setBooks(books)
    } catch (e) {
      setBooks([])
    } finally {
      return books.value
    }
  }

  async function loadBook(id: String) {
    try {
      const { book } = await fetchBook(api, id)
      setBook(book)
    } catch (e) {
      setBook(null)
    } finally {
      return book.value
    }
  }

  async function loadMessagesForBook(bookId: String) {
    try {
      const { bookMessages } = await fetchMessagesForBook(api, bookId)
      setMessages(bookMessages)
    } catch (e) {
      setMessages([])
    } finally {
      return book.value
    }
  }

  async function sendMessageInBook(bookId: String, message: String) {
    try {
      const { bookMessage } = await postMessageInBook(api, bookId, message)
      pushNewMessage(bookMessage)
      return bookMessage
    } catch (e) {
      return null
    }
  }

  return {
    books,
    book,
    messages,
    setBooks,
    setBook,
    setMessages,
    loadBooksForClient,
    loadBooksForUser,
    loadBook,
    loadMessagesForBook,
    sendMessageInBook,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBook, import.meta.hot))
}
