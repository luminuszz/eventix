import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "./env.module";

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  public get<EnvKey extends keyof EnvConfig>(envKey: EnvKey): EnvConfig[EnvKey] {
    return this.configService.get(envKey, { infer: true })!;
  }
}
