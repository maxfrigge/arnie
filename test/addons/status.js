import test from 'tape'
import {setupKoa, teardownKoa} from '../utils/koa'
import middleware from '../../src/core/middleware'
import status from '../../src/addons/status'

test('Addon: status()', (t) => {
  t.plan(1)

  const koa = setupKoa()
  const task = [
    status(201)
  ]
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/').end((err, res) => {
    if (!err) {
      t.equal(
        res.status,
        201,
        'should set http status code'
      )
    }
    teardownKoa(koa)
  })
})
