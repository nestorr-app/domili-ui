import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composable/useApi'
import { fetchClientsForCompany, fetchClient } from '../utils/api/client'

export type ClientData = Record<string, any> | null

export const useClient = defineStore('client', () => {
  const api = useApi()

  const clients = ref<Partial<ClientData[]>>([])
  const client = ref<Partial<ClientData>>(null)

  function setClients(newclients: Partial<ClientData[]>) {
    clients.value = newclients
  }

  function setClient(newclient: Partial<ClientData>) {
    client.value = newclient
  }

  async function loadClientsForCompany(companyId: String) {
    try {
      const { clients: fetchedClients } = await fetchClientsForCompany(api, companyId)
      clients.value = fetchedClients
    } catch (e) {
      clients.value = []
    } finally {
      return clients.value
    }
  }

  async function loadClient(id: String) {
    try {
      const { client } = await fetchClient(api, id)
      setClient(client)
    } catch (e) {
      setClient(null)
    } finally {
      return client.value
    }
  }

  return {
    clients,
    client,
    setClients,
    setClient,
    loadClientsForCompany,
    loadClient,
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
  import.meta.hot.accept(acceptHMRUpdate(useClient, import.meta.hot))
}
