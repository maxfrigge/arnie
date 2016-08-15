import test from 'tape'
import supertest from 'supertest'
import Koa from 'koa'
import middleware from '../../src/core/middleware'
import cors from '../../src/addons/cors'

function setup () {
  const app = new Koa()
  const server = app.listen()
  const request = supertest.agent(server)

  return {
    app,
    request,
    server
  }
}

function teardown (fixtures) {
  fixtures.server.close()
}

test('Addon: cors()', (t) => {
  t.plan(2)

  const fixtures = setup()
  const task = [
    cors('get, post', 'http://foo.example')
  ]
  fixtures.app.use(
    middleware({
      task
    })
  )

  fixtures.request.get('/').end((err, res) => {
    if (!err) {
      t.equal(
        res.header['access-control-allow-methods'],
        'get, post',
        'should set allowed methods'
      )
      t.equal(
        res.header['access-control-allow-origin'],
        'http://foo.example',
        'should set allowed origin'
      )
    }
    teardown(fixtures)
  })
})
