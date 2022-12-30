
import type { AxiosInstance } from 'axios'

export async function login(
  api: AxiosInstance,
  email: String,
  password: String,
) {
  const { data: { token } } = await api.post(`/auth/login`, { email, password })

  return { token }
}
