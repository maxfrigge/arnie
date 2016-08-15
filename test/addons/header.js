import test from 'tape'
import supertest from 'supertest'
import Koa from 'koa'
import middleware from '../../src/core/middleware'
import header from '../../src/addons/header'

function setup () {
  const app = new Koa()
  const server = app.listen()
  const request = supertest.agent(server)

  return {
    app,
    request,
    server
  }
}

function teardown (fixtures) {
  fixtures.server.close()
}

test('Addon: header()', (t) => {
  t.plan(3)

  const fixtures = setup()
  const task = [
    header('Cache-Control', 'no-cache'),
    header({
      'Foo': 'bar',
      'Bar': 'foo'
    })
  ]
  fixtures.app.use(
    middleware({
      task
    })
  )

  fixtures.request.get('/').end((err, res) => {
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
    teardown(fixtures)
  })
})
