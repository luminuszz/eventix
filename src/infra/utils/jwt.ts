export const EXPIRES_AT_TOKEN = '3d'

export interface JwtPayload {
  email: string
  name: string
  id: string
}
