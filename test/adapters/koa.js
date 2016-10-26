const test = require('tape')
const {setupKoa, teardownKoa} = require('../utils/koa')
const A = require('../../src/adapters/koa')
const arnie = A()

test('Arnie (koa)', (t) => {
  t.plan(4)

  const koa = setupKoa()
  const actionNum = {
    taskA: 0
  }
  const testExecution = (group, order) => {
    t.equal(
      actionNum[group] += 1,
      order,
      `should run each action on request in order (${group} ${order})`
    )
  }

  const taskA = [
    (ctx) => {
      testExecution('taskA', 1)
      return new Promise((resolve) => {
        setTimeout(
          () => resolve(ctx.path.goHere({someOutput: true})),
          50
        )
      })
    }, {
      dontGoHere: [
        () => t.fail('should NOT run this action')
      ],
      goHere: [
        (ctx) => testExecution('taskA', 2)
      ]
    },
    (ctx) => testExecution('taskA', 3)
  ]

  koa.app.use(
    arnie(taskA)
  )

  koa.request.get('/').end(() => {
    t.equal(
      actionNum.taskA,
      3,
      'should complete taskA before request ends'
    )
    teardownKoa(koa)
  })
})
