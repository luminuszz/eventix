import { Injectable, PipeTransform } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class ParseUUIDPipePipe implements PipeTransform {
  transform(value: string) {
    return z.string().uuid().parse(value)
  }
}
