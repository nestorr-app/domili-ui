
import type { AxiosInstance } from 'axios'

export interface Client {
  id: string
  label: string
}

export async function fetchClientsForCompany(
  api: AxiosInstance,
  companyId: String,
): Promise<{ clients: Client[] }> {
  const { data: clients } = await api.get<Client[]>(
    `/clients/company/${companyId}`
  )

  return { clients }
}
