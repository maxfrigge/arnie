import test from 'tape'
import supertest from 'supertest'
import Koa from 'koa'
import middleware from '../../src/core/middleware'

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

test('Run all tasks as Koa middleware', (t) => {
  const fixtures = setup()

  t.plan(5)

  let actionNum = 0
  const shouldNotRun = () => t.fail('should never run this action')
  const shouldRun = (index) => {
    return () => {
      t.equal(actionNum += 1, index)
      return {someOutput: true}
    }
  }

  const taskA = [
    shouldRun(1), {
      dontGoHere: [
        shouldNotRun
      ]
    },
    shouldRun(2)
  ]

  const taskB = [
    shouldRun(3), {
      someOutput: [
        shouldRun(4)
      ]
    }
  ]

  fixtures.app.use(
    middleware({
      taskA,
      taskB
    })
  )

  fixtures.request.get('/').end(() => {
    t.pass('requst complete')
    teardown(fixtures)
  })
})
