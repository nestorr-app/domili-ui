
import type { AxiosInstance } from 'axios'
import { Book } from './BookInterface'

export async function fetchBook(
  api: AxiosInstance,
  id: String,
): Promise<{ book: Book }> {
  const { data: book } = await api.get<Book>(
    `/books/${id}`
  )

  return { book }
}
