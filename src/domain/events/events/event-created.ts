import { EventEntity } from "../entities/event.entity";

export class EventCreated {
  constructor(public readonly event: EventEntity) {}
}
