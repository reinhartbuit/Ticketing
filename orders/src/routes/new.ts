import express, { Request, Response } from 'express';
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  OrderStatus,
  BadRequestError,
} from '@rbtgittix/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders/',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket ID must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the Ticket the user is trying to order in DB
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    //Make sure the ticket is not reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an Expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
    // Build the order and save it to the DB

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    //Publish event order was created

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
function input(input: any) {
  throw new Error('Function not implemented.');
}
