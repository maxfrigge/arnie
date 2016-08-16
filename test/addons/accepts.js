import test from 'tape'
import {
  setupKoa,
  teardownKoa
} from '../utils/koa'
import middleware from '../../src/core/middleware'
import accepts from '../../src/addons/accepts'

test('Addon: accepts()', (t) => {
  t.plan(3)

  const testAcceptance = (accept, path = accept) => {
    return (ctx) => {
      t.ok(
        ctx.accepts(accept),
        `should execute ${path} task when ${accept} accepted`
      )
    }
  }

  const koa = setupKoa()
  const task = [
    accepts({
      json: [testAcceptance('json')],
      html: [testAcceptance('html')]
    }),
    accepts(['json', 'html'], {
      otherwise: [testAcceptance('text', 'otherwise')]
    })
  ]
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/').accept('json').end(teardownWhenComplete)
  koa.request.get('/').accept('html').end(teardownWhenComplete)
  koa.request.get('/').accept('text').end(teardownWhenComplete)

  let requestCount = 0
  function teardownWhenComplete () {
    requestCount += 1
    if (requestCount === 3) {
      teardownKoa(koa)
    }
  }
})
