import { Publisher, Subjects, TicketUpdatedEvent } from '@rbtgittix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
