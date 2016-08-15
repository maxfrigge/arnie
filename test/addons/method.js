import test from 'tape'
import supertest from 'supertest'
import Koa from 'koa'
import middleware from '../../src/core/middleware'
import method from '../../src/addons/method'

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

test('Addon: method()', (t) => {
  t.plan(5)

  const testRequestMethod = (expectedMethod) => {
    return (ctx) => {
      const actualMethod = ctx.request.method.toLowerCase()
      t.equal(
        actualMethod,
        expectedMethod,
        `should execute ${expectedMethod} task on ${expectedMethod} request`
      )
    }
  }

  const fixtures = setup()
  const task = [
    method({
      get: [testRequestMethod('get')],
      post: [testRequestMethod('post')],
      put: [testRequestMethod('put')],
      delete: [testRequestMethod('delete')],
      options: [testRequestMethod('options')]
    })
  ]
  fixtures.app.use(
    middleware({
      task
    })
  )

  fixtures.request.get('/').end(teardownWhenComplete)
  fixtures.request.post('/').end(teardownWhenComplete)
  fixtures.request.put('/').end(teardownWhenComplete)
  fixtures.request.delete('/').end(teardownWhenComplete)
  fixtures.request.options('/').end(teardownWhenComplete)

  let requestCount = 0
  function teardownWhenComplete () {
    requestCount += 1
    if (requestCount === 5) {
      teardown(fixtures)
    }
  }
})
