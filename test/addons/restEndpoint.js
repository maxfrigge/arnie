import test from 'tape'
import {
  setupKoa,
  teardownKoa
} from '../utils/koa'
import middleware from '../../src/core/middleware'
import route from '../../src/addons/route'
import restEndpoint from '../../src/addons/restEndpoint'

test('Addon: restEndpoint()', (t) => {
  t.plan(7)

  const testRequest = (path, expectedMethod, expectedId = undefined) => {
    return (ctx) => {
      const actual = {
        method: ctx.request.method.toLowerCase(),
        id: ctx.input.id
      }
      const expected = {
        method: expectedMethod,
        id: expectedId
      }
      let idInfo = expectedId ? 'with id' : 'without id'
      t.deepEqual(
        actual,
        expected,
        `should execute ${path} task on ${expectedMethod} ${idInfo}`
      )
    }
  }

  const task = [
    route('/resource/:id?', [
      restEndpoint({
        list: [testRequest('list', 'get')],
        show: [testRequest('show', 'get', '123')],
        create: [testRequest('create', 'post')],
        update: [testRequest('update', 'post', '123')],
        clear: [testRequest('clear', 'delete')],
        remove: [testRequest('remove', 'delete', '123')]
      })
    ])
  ]

  const koa = setupKoa()
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/resource').end(teardownWhenComplete)
  koa.request.get('/resource/123').end(teardownWhenComplete)
  koa.request.post('/resource').end(teardownWhenComplete)
  koa.request.post('/resource/123').end(teardownWhenComplete)
  koa.request.delete('/resource').end(teardownWhenComplete)
  koa.request.delete('/resource/123').end(teardownWhenComplete)
  koa.request.put('/resource/123').end((err, res) => {
    if (!err) {
      t.equal(
        res.status,
        405,
        'should send 405 status if method is not supported'
      )
    }
    teardownWhenComplete()
  })

  let requestCount = 0
  function teardownWhenComplete () {
    requestCount += 1
    if (requestCount === 7) {
      teardownKoa(koa)
    }
  }
})
