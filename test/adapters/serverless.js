const test = require('tape')
const {setupServerless} = require('../utils/serverless')
const A = require('../../src/adapters/serverless')

test('Adapter: Serverless', (t) => {
  t.plan(13)

  const arnie = A({providers: [
    (context) => {
      context.anotherProvider = 'test'
      return context
    }
  ]})

  const actionNum = {
    taskA: 0,
    taskB: 0
  }
  const testExecutionOrder = (group, order) => {
    t.equal(actionNum[group] += 1, order, `should run each action on request in order (${group} ${order})`)
  }

  const expectedError = new Error('error')
  const taskA = [
    (ctx) => {
      t.assert(typeof ctx.output, 'should provide output in context')
      t.assert(typeof ctx.request, 'should provide request in context')
      t.assert(typeof ctx.response, 'should provide reponse in context')
      t.equal(ctx.anotherProvider, 'test', 'should pass additional providers to function-tree')
      testExecutionOrder('taskA', 1)
      throw expectedError
    }
  ]

  const taskB = [
    ({input, path}) => {
      testExecutionOrder('taskB', 1)
      return new Promise((resolve) => {
        setTimeout(() => resolve(path.goHere({someOutput: true})), 50)
      })
    }, {
      dontGoHere: [
        () => t.fail('should NOT run this action')
      ],
      goHere: [
        ({response}) => {
          testExecutionOrder('taskB', 2)
          response.body = 'text'
        }
      ]
    },
    (ctx) => testExecutionOrder('taskB', 3)
  ]

  const serverless = setupServerless({
    '/error': arnie(taskA),
    '/success': arnie(taskB)
  })

  serverless.request.get('/error').end((error, result) => {
    if (!error) {
      t.equal(result.statusCode, 500, 'should send status code 500 on unhandled error')
    }
  })

  serverless.request.get('/success').end((error, result) => {
    if (!error) {
      t.equal(actionNum.taskB, 3, 'should complete taskB before request ends')
      t.equal(result.text, 'text', 'should send the body')
      t.equal(result.statusCode, 200, 'should send the status code')
      t.equal(result.headers['content-type'], 'text/plain; charset=utf-8', 'should send the content type')
    }
  })
})
