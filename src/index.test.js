const t = require('tap')
const A = require('../src')
const {sequence, parallel} = require('../src')
const arnie = A()

// const operators = require('../operators')
// const providers = require('../providers')
// const serverless = require('../serverless')

t.test('Arnie', (t) => {
  t.plan(5)

  // t.assert(serverless, 'should expose: const serverless = require(arnie/serverless)')
  // t.assert(operators.forEach, 'should expose: const {forEach} = require(arnie/operators)')
  // t.assert(operators.set, 'should expose: const {set} = require(arnie/operators)')
  // t.assert(operators.when, 'should expose: const {when} = require(arnie/operators)')
  // t.assert(operators.when, 'should expose: const {when} = require(arnie/operators)')
  // t.assert(providers.HttpResponseProvider, 'should expose: const {HttpResponseProvider} = require(arnie/providers)')
  // t.assert(providers.OutputProvider, 'should expose: const {OutputProvider} = require(arnie/providers)')
  // t.assert(providers.ServerlessRequestProvider, 'should expose: const {ServerlessRequestProvider} = require(arnie/providers)')

  let parallelCount = 0
  const inititalData = {foo: 'bar'}
  const mutation = {foo: 'mutated'}
  const expectedOutput = {
    foo: mutation.foo,
    bar: 'foo'
  }

  const task = sequence([
    ({props}) => {
      t.deepEqual(
        props,
        inititalData,
        'should execute first action with initital props'
      )
      return Promise.resolve(mutation)
    },
    ({props}) => {
      t.deepEqual(
        props,
        mutation,
        'should execute subsequent action with mutated props'
      )
      return {bar: expectedOutput.bar}
    },
    parallel([
      ({props}) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            parallelCount += 1
            t.assert(parallelCount === 2, 'should allow parallel execution')
            resolve()
          }, 100)
        })
      },
      ({props}) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            parallelCount += 1
            resolve()
          }, 1)
        })
      }
    ])
  ])

  arnie(task, inititalData)
    .then((output) => {
      t.deepEqual(
        output,
        expectedOutput,
        'should run function tree and resolve with final payload'
      )
    })

  const expectedError = new Error('error')
  arnie([() => { throw expectedError }])
    .then(() => t.fail('should not resolve on error'))
    .catch((error) => {
      t.equal(
        error,
        expectedError,
        'should reject failed execution with error'
      )
    })
})
