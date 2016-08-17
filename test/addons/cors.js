import test from 'tape'
import {setupKoa, teardownKoa} from '../utils/koa'
import middleware from '../../src/core/middleware'
import cors from '../../src/addons/cors'

test('Addon: cors()', (t) => {
  t.plan(2)

  const koa = setupKoa()
  const task = [
    cors('get, post', 'http://foo.example')
  ]
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/').end((err, res) => {
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
    teardownKoa(koa)
  })
})
