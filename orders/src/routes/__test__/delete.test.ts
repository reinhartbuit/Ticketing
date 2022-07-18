import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks the order as cancelled', async () => {
  //Create a Ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  //make a request to Create and order
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to cancel the order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);
  //Expect status = cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  //make a request to Create and order
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);
  //make a request to cancel the order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
