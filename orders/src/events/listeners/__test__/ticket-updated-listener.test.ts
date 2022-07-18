import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@rbtgittix/common';
import { Ticket } from '../../../models/ticket';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

const setup = async () => {
  //Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);
  //Create an save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });

  await ticket.save();
  //Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'concert2',
    price: 20,
    userId: '1234',
  };
  //Create a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { msg, data, ticket, listener };
  //Return stuff
};

it('finds,updates and save a ticket', async () => {
  const { msg, data, ticket, listener } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
