export enum OrderStatus {
  Created = 'created', // When the order has been created but with no ticket reserved
  Cancelled = 'cancelled', //The ticket the order is trying to reserve, but already reserved, or when manually cancelling, or OrderExpired
  AwaitingPayment = 'awaiting:payment', //Ticket Reserved successfully
  Complete = 'complete', // The order has reserved the ticket and payment completed
}
