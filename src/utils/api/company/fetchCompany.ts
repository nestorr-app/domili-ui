
import type { AxiosInstance } from 'axios'

export interface Company {
  id: string
  label: string
}

export async function fetchCompany(
  api: AxiosInstance,
  id: String,
): Promise<{ company: Company }> {
  const { data: company } = await api.get<Company>(
    `/companies/${id}`
  )

  return { company }
}
