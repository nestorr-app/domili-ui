
import type { AxiosInstance } from 'axios'
import { BookMessage } from './BookMessageInterface'

export async function fetchMessagesForBook(
  api: AxiosInstance,
  bookId: String,
): Promise<{ bookMessages: BookMessage[] }> {
  const { data: bookMessages } = await api.get<BookMessage[]>(
    `/book-messages/book/${bookId}`
  )

  return { bookMessages }
}
