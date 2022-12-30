import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '../composable/useApi'
import { fetchMakersForCompany } from '../utils/api/maker'

export type MakerData = Record<string, any> | null

export const useMaker = defineStore('maker', () => {
  const api = useApi()

  const makers = ref<Partial<MakerData[]>>([])

  function setMakers(newMakers: Partial<MakerData[]>) {
    makers.value = newMakers
  }

  async function loadMakersForCompany(companyId) {
    try {
      const { makers: fetchedMakers } = await fetchMakersForCompany(api, companyId)
      makers.value = fetchedMakers
    } catch (e) {
      makers.value = []
    } finally {
      return makers.value
    }
  }

  return {
    makers,
    setMakers,
    loadMakersForCompany,
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
  import.meta.hot.accept(acceptHMRUpdate(useMaker, import.meta.hot))
}
