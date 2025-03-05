export class TicketApprovedEvent {
  constructor(
    public readonly ticketId: string,
    public readonly userId: string,
  ) {}
}
