
import type { AxiosInstance } from 'axios'

export interface Me {
  id: string
  email: string
  firstname: string
  lastname: string
  role: string
}

export async function fetchMe(
  api: AxiosInstance
): Promise<{ me: Me }> {
  const { data: me } = await api.get<Me>(
    `/auth/me`
  )

  return { me }
}
