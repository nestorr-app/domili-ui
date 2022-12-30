
import type { AxiosInstance } from 'axios'

export interface Client {
  id: string
  label: string
}

export async function fetchClient(
  api: AxiosInstance,
  id: String,
): Promise<{ client: Client }> {
  const { data: client } = await api.get<Client>(
    `/clients/${id}`
  )

  return { client }
}
