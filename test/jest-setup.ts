import { SetupServer } from '@src/server';
import supertest from 'supertest';

/* Runs before any test. Used to initialize the server or database */
beforeAll(() => {
  const server = new SetupServer();
  server.init();
  global.testRequest = supertest(server.getApp());
});
