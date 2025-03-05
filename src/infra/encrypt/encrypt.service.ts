import { HashProvider } from '@domain/users/contracts/hash.provider'
import * as argon from 'argon2'

export class EncryptService implements HashProvider {
  async hash(value: string): Promise<string> {
    return await argon.hash(value)
  }
  async compare(value: string, hashToCompare: string): Promise<boolean> {
    return await argon.verify(hashToCompare, value)
  }
}
