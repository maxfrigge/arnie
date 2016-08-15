import test from 'tape'
import {
  setupKoa,
  teardownKoa
} from '../utils/koa'
import middleware from '../../src/core/middleware'

test('Given multiple tasks, middleware()', (t) => {
  t.plan(5)

  const koa = setupKoa()
  let actionNum = 0
  const shouldNotRun = () => t.fail('should NOT run this action')
  const shouldRun = (order) => {
    return () => {
      t.equal(
        actionNum += 1,
        order,
        `should run each action as middleware in sequential order (${order})`
      )
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

  koa.app.use(
    middleware({
      taskA,
      taskB
    })
  )

  koa.request.get('/').end(() => {
    t.pass('should complete each task')
    teardownKoa(koa)
  })
})
