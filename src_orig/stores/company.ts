import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCompany } from '../utils/api/company'
import { useApi } from '../composable/useApi'

export type CompanyData = Record<string, any> | null

export const useCompany = defineStore('company', () => {
  const api = useApi()

  const company = ref<Partial<CompanyData>>()

  function setCompany(newCompany: Partial<CompanyData>) {
    company.value = newCompany
  }

  async function loadCompany(id) {
    try {
      const { company: fetchedCompany } = await fetchCompany(api, id)
      company.value = fetchedCompany
    } catch (e) {}
  }

  return {
    company,
    setCompany,
    loadCompany,
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
  import.meta.hot.accept(acceptHMRUpdate(useCompany, import.meta.hot))
}
