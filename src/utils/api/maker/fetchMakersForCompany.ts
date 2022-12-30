
import type { AxiosInstance } from 'axios'

export interface Maker {
  id: string
  firstname: string
  lastname: string
}

export async function fetchMakersForCompany(
  api: AxiosInstance,
  companyId: String,
): Promise<{ makers: Maker[] }> {
  const { data: makers } = await api.get<Maker[]>(
    `/makers/company/${companyId}`
  )

  return { makers }
}
