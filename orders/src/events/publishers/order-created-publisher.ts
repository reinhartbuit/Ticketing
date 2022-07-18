import { Publisher, OrderCreatedEvent, Subjects } from '@rbtgittix/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
