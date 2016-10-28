const test = require('tape')
const {setupServerless} = require('../utils/serverless')
const A = require('../../src/adapters/serverless')
const arnie = A()

test('Arnie (serverless)', (t) => {
  t.plan(9)

  const actionNum = {
    taskA: 0,
    taskB: 0
  }
  const testExecutionOrder = (group, order) => {
    t.equal(actionNum[group] += 1, order, `should run each action on request in order (${group} ${order})`)
  }

  const taskA = [
    ({input, path}) => {
      testExecutionOrder('taskA', 1)
      return new Promise((resolve) => {
        setTimeout(() => resolve(path.goHere({someOutput: true})), 50)
      })
    }, {
      dontGoHere: [
        () => t.fail('should NOT run this action')
      ],
      goHere: [
        ({response}) => {
          testExecutionOrder('taskA', 2)
          response.body = 'text'
        }
      ]
    },
    (ctx) => testExecutionOrder('taskA', 3)
  ]

  const expectedError = new Error('error')
  const taskB = [
    (ctx) => {
      testExecutionOrder('taskB', 1)
      throw expectedError
    }
  ]

  const serverless = setupServerless({
    '/success': arnie(taskA),
    '/error': arnie(taskB)
  })

  serverless.request.get('/error').end((error, result) => {
    if (!error) {
      t.equal(result.statusCode, 500, 'should send status code 500 on unhandled error')
    }
  })

  serverless.request.get('/success').end((error, result) => {
    if (!error) {
      t.equal(actionNum.taskA, 3, 'should complete taskA before request ends')
      t.equal(result.text, 'text', 'should send the body')
      t.equal(result.statusCode, 200, 'should send the status code')
      t.equal(result.headers['content-type'], 'text/plain; charset=utf-8', 'should send the content type')
    }
  })
})
