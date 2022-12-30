
import type { AxiosInstance } from 'axios'
import { BookMessage } from './BookMessageInterface'

export async function postMessageInBook(
  api: AxiosInstance,
  bookId: String,
  message: String,
): Promise<{ bookMessage: BookMessage }> {
  const { data: bookMessage } = await api.post<BookMessage>(
    `/book-messages/book/${bookId}`,
    { message }
  )

  return { bookMessage }
}
