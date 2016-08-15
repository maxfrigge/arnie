import Koa from 'koa'
import supertest from 'supertest'

export function setupKoa () {
  const app = new Koa()
  const server = app.listen()
  const request = supertest.agent(server)

  return {
    app,
    request,
    server
  }
}

export function teardownKoa (koa) {
  koa.server.close()
}
