import test from 'tape'
import {
  setupKoa,
  teardownKoa
} from '../utils/koa'
import middleware from '../../src/core/middleware'
import route from '../../src/addons/route'

test('Addon: route()', (t) => {
  t.plan(6)

  const testRequest = (expectedPath, expectedInput = {}) => {
    return (ctx) => {
      t.equal(
        ctx.request.path,
        expectedPath,
        `should execute matched route from url ${expectedPath}`
      )
      t.deepEqual(
        ctx.input,
        expectedInput,
        'should get url params as input'
      )
    }
  }
  const expectedRouteKeys = [ { delimiter: '/', name: 'param', optional: false, pattern: '[^\\/]+?', prefix: '/', repeat: false } ]
  const koa = setupKoa()
  const task = [
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
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/with/foo/in-path').end(teardownWhenComplete)
  koa.request.get('/without/param').end(teardownWhenComplete)
  koa.request.get('/with/foo/and-query?search=bar&more=123').end(teardownWhenComplete)

  let requestCount = 0
  function teardownWhenComplete () {
    requestCount += 1
    if (requestCount === 3) {
      teardownKoa(koa)
    }
  }
})
