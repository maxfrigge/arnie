const test = require('tape')
const {setupServerless} = require('../utils/serverless')
const A = require('../../src/adapters/serverless')
const arnie = A()

test('Arnie (serverless)', (t) => {
  t.plan(6)

  const actionNum = {
    taskA: 0,
    taskB: 0
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

  const expectedError = new Error('error')
  const taskB = [
    (ctx) => {
      testExecution('taskB', 1)
      throw expectedError
    }
  ]

  const serverless = setupServerless({
    '/success': arnie(taskA),
    '/error': arnie(taskB)
  })

  serverless.request('/error', (error, result) => {
    t.equal(
      error,
      expectedError,
      'should reject failed execution with error'
    )
  })

  const expectedResult = {path: '/success', someOutput: true}
  serverless.request('/success', (error, result) => {
    if (!error) {
      t.deepEqual(
        result,
        expectedResult,
        'should resolve successful execution with final output'
      )
    }
  })
})
