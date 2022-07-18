import { Publisher, OrderCancelledEvent, Subjects } from '@rbtgittix/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
