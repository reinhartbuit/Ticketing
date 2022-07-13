import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'fdagadgadsg';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  //Building JWT payload. {id,email}
  const payload = {
    id: '4546464',
    email: 'test@test.com',
  };

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object {jwt: Myjwt}
  const session = { jwt: token };
  //Turn into JSON
  const seasionJSON = JSON.stringify(session);

  //Encode JSON to base 64
  const base64 = Buffer.from(seasionJSON).toString('base64');

  //return a string that the cooking with encoded data
  return [`session=${base64}`];
};
