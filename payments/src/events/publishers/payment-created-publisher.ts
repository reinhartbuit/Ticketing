import { Subjects, Publisher, PaymentsCreatedEvent } from '@rbtgittix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentsCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
