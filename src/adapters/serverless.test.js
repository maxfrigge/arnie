const t = require('tap')
const ServerlessEndpoint = require('../test/serverless-endpoint')
const A = require('./serverless')

t.test('Adapter: Serverless', (t) => {
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

  const taskA = [
    (ctx) => {
      t.assert(ctx.output, 'should provide output in context')
      t.assert(ctx.request, 'should provide request in context')
      t.assert(ctx.response, 'should provide reponse in context')
      t.equal(ctx.anotherProvider, 'test', 'should pass additional providers to function-tree')
      testExecutionOrder('taskA', 1)
      throw new Error('Error in taskA')
    }
  ]

  const taskB = [
    ({props, path}) => {
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

  const serverless = ServerlessEndpoint({
    '/error': arnie(taskA),
    '/success': arnie(taskB)
  })

  serverless.get('/error').end((error, result) => {
    if (!error) {
      t.equal(result.statusCode, 500, 'should send status code 500 on unhandled error')
    }
  })

  serverless.get('/success').end((error, result) => {
    if (!error) {
      t.equal(actionNum.taskB, 3, 'should complete taskB before request ends')
      t.equal(result.text, 'text', 'should send the body')
      t.equal(result.statusCode, 200, 'should send the status code')
      t.equal(result.headers['content-type'], 'text/plain; charset=utf-8', 'should send the content type')
    }
  })
})
