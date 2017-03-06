// const Koa = require('koa')
// const supertest = require('supertest')
//
// module.exports.setupKoa = () => {
//   const app = new Koa()
//   const server = app.listen()
//   const request = supertest.agent(server)
//
//   return {
//     app,
//     request,
//     server
//   }
// }
//
// module.exports.teardownKoa = (koa) => {
//   koa.server.close()
// }
