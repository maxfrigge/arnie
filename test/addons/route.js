import test from 'tape'
import {setupKoa, teardownKoa} from '../utils/koa'
import middleware from '../../src/core/middleware'
import {route} from '../../addons'

test('Addon: route()', (t) => {
  t.plan(7)

  const testRequest = (expectedPath, expectedInput) => {
    return (ctx) => {
      t.equal(
        ctx.request.path,
        expectedPath,
        `should execute matched route from url ${expectedPath}`
      )
      if (expectedInput) {
        t.deepEqual(
          ctx.input,
          expectedInput,
          'should get url params as input'
        )
      }
    }
  }
  const expectedRouteKeys = [ { name: 'param', optional: false } ]
  const koa = setupKoa()
  const task = [
    route({
      '/multiple/routes/1': [
        testRequest('/multiple/routes/1')
      ],
      '/multiple/routes/2': [
        testRequest('/multiple/routes/2')
      ],
      otherwise: [
        route('/with/:param/in-path', [
          testRequest('/with/foo/in-path', {param: 'foo', routeKeys: expectedRouteKeys})
        ]),
        route('/without/param', [
          testRequest('/without/param')
        ]),
        route('/with/:param/and-query', [
          testRequest('/with/foo/and-query', {param: 'foo', search: 'bar', more: '123', routeKeys: expectedRouteKeys})
        ])
      ]
    })
  ]
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/multiple/routes/1').end(teardownWhenComplete)
  koa.request.get('/multiple/routes/2').end(teardownWhenComplete)
  koa.request.get('/with/foo/in-path').end(teardownWhenComplete)
  koa.request.get('/without/param').end(teardownWhenComplete)
  koa.request.get('/with/foo/and-query?search=bar&more=123').end(teardownWhenComplete)

  let requestCount = 0
  function teardownWhenComplete () {
    requestCount += 1
    if (requestCount === 5) {
      teardownKoa(koa)
    }
  }
})
