import request from 'supertest'
import { app } from '../../app'

it('has a route handler listing to /api/tickets for posts requests',async () => {
    const response = await request(app)
    .post('/api/tickets')
    .send({})
    //console.log(response.status)
    expect(response.status).not.toEqual(400);

})
it('can only be access if the user is signed in',async () => {
    
})
it('return an error if an invalid title is provided',async () => {
    
})
it('returns and error if an invalid price is provided',async () => {
    
})
it('creates a ticket with valid inputs',async () => {
    
})