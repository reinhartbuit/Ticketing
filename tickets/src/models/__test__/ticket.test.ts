import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  //Create an instance of a Ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  //Save Ticket to DB
  await ticket.save();
  //Fetch the ticket twice

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two seperate changes
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //Save the first fetch ticket
  await firstInstance!.save();
  //Save the second fetch ticket and expect and error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple save', async () => {});
