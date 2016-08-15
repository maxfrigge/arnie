import test from 'tape'
import {
  setupKoa,
  teardownKoa
} from '../utils/koa'
import middleware from '../../src/core/middleware'
import header from '../../src/addons/header'

test('Addon: header()', (t) => {
  t.plan(3)

  const koa = setupKoa()
  const task = [
    header('Cache-Control', 'no-cache'),
    header({
      'Foo': 'bar',
      'Bar': 'foo'
    })
  ]
  koa.app.use(
    middleware({
      task
    })
  )

  koa.request.get('/').end((err, res) => {
    if (!err) {
      t.equal(
        res.header['cache-control'],
        'no-cache',
        'should set reponse header'
      )
      t.equal(
        res.header['foo'],
        'bar',
        'should set reponse header'
      )
      t.equal(
        res.header['bar'],
        'foo',
        'should set reponse header'
      )
    }
    teardownKoa(koa)
  })
})
