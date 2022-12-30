
import type { AxiosInstance } from 'axios'
import { Book } from './BookInterface'

export async function fetchBooksForUser(
  api: AxiosInstance,
): Promise<{ books: Book[] }> {
  const { data: books } = await api.get<Book[]>(
    `/books`
  )

  return { books }
}
