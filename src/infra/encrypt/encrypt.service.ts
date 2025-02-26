import * as argon from "argon2";
import { HashProvider } from "src/domain/users/contracts/hash.provider";

export class EncryptService implements HashProvider {
  async hash(value: string): Promise<string> {
    return await argon.hash(value);
  }
  async compare(value: string, hashToCompare: string): Promise<boolean> {
    return await argon.verify(hashToCompare, value);
  }
}
