
import type { AxiosInstance } from 'axios'
import { Book } from './BookInterface'

export async function fetchBooksForClient(
  api: AxiosInstance,
  clientId: String,
): Promise<{ books: Book[] }> {
  const { data: books } = await api.get<Book[]>(
    `/books/client/${clientId}`
  )

  return { books }
}
