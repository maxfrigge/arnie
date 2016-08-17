import test from 'tape'
import {setupKoa, teardownKoa} from '../utils/koa'
import middleware from '../../src/core/middleware'
import fail from '../../src/addons/fail'

test('Addon: fail()', (t) => {
  t.plan(2)

  const koa = setupKoa()
  const task = [
    () => t.pass('should let preceding actions run'),
    fail(401, 'access_denied'),
    () => t.fail('should NOT let following actions run')
  ]
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/').end((err, res) => {
    if (!err) {
      const actualError = {
        status: res.status,
        text: res.error.text
      }
      const expectedError = {
        status: 401,
        text: 'access_denied'
      }
      t.deepEqual(
        actualError,
        expectedError,
        'should create an error reponse'
      )
    }
    teardownKoa(koa)
  })
})
