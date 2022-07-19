import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@rbtgittix/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
