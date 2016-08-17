import test from 'tape'
import {setupKoa, teardownKoa} from '../utils/koa'
import middleware from '../../src/core/middleware'
import {redirect} from '../../addons'

test('Addon: redirect()', (t) => {
  t.plan(2)

  const koa = setupKoa()
  const task = [
    redirect('/redirect-target')
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
        302,
        'should set http status code 302'
      )
      t.equal(
        res.header.location,
        '/redirect-target',
        'should set the given path as location header'
      )
    }
    teardownKoa(koa)
  })
})
