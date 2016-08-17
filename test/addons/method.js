import test from 'tape'
import {setupKoa, teardownKoa} from '../utils/koa'
import middleware from '../../src/core/middleware'
import {method} from '../../addons'

test('Addon: method()', (t) => {
  t.plan(5)

  const testRequestMethod = (expectedMethod, path = expectedMethod) => {
    return (ctx) => {
      const actualMethod = ctx.request.method.toLowerCase()
      t.equal(
        actualMethod,
        expectedMethod,
        `should execute ${path} task on ${expectedMethod} request`
      )
    }
  }

  const koa = setupKoa()
  const task = [
    method({
      get: [testRequestMethod('get')],
      post: [testRequestMethod('post')],
      put: [testRequestMethod('put')],
      options: [testRequestMethod('options')],
      otherwise: [testRequestMethod('delete', 'otherwise')]
    })
  ]
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/').end(teardownWhenComplete)
  koa.request.post('/').end(teardownWhenComplete)
  koa.request.put('/').end(teardownWhenComplete)
  koa.request.delete('/').end(teardownWhenComplete)
  koa.request.options('/').end(teardownWhenComplete)

  let requestCount = 0
  function teardownWhenComplete () {
    requestCount += 1
    if (requestCount === 5) {
      teardownKoa(koa)
    }
  }
})
