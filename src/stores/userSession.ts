import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { fetchMe, login as loginApi } from '../utils/api/auth'
import { useApi } from '../composable/useApi'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  const api = useApi()
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/
  const token = useStorage('token', '')

  const user = ref<Partial<UserData>>()
  const loading = ref(false)

  const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')

  function setUser(newUser: Partial<UserData>) {
    if (!newUser?.id) {
      user.value = null
      return
    }

    user.value = {
      ...newUser,
      initials: `${newUser.firstname.charAt(0).toUpperCase()}${newUser.lastname.charAt(0).toUpperCase()}`
    }
  }

  function setToken(newToken: string) {
    token.value = newToken || null
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  async function loadMe() {
    if (loading.value) return

    loading.value = true

    try {
      const { me } = await fetchMe(api)
      setUser(me)
    } finally {
      loading.value = false
    }
  }

  async function login({ email, password }) {
    await logoutUser()
    try {
      const { token } = await loginApi(api, email, password)

      setToken(token)
      await loadMe()

      return user.value
    } catch (e) {
      console.log(e)
    }

    return null
  }

  async function logoutUser() {
    token.value = undefined
    user.value = undefined
  }

  return {
    user,
    token,
    isLoggedIn,
    loading,
    loadMe,
    login,
    logoutUser,
    setUser,
    setToken,
    setLoading,
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
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))
}
