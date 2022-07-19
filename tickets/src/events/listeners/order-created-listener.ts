import { Listener, OrderCreatedEvent, Subjects } from '@rbtgittix/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket the order is resevering
    const ticket = await Ticket.findById(data.ticket.id);

    //Throw error if not found
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // Mark the ticketing as reserved by setting OrderId
    ticket.set({ orderId: data.id });
    //Save the ticket
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });
    //ack message

    msg.ack();
  }
}
