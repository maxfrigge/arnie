const test = require('tape')
const A = require('../src')
const arnie = A()

const operators = require('../operators')
const providers = require('../providers')
const serverless = require('../serverless')

test('Arnie', (t) => {
  t.plan(12)

  t.assert(serverless, 'should offer: const serverless = require(arnie/serverless)')
  t.assert(operators.forEach, 'should offer: const {forEach} = require(arnie/operators)')
  t.assert(operators.set, 'should offer: const {set} = require(arnie/operators)')
  t.assert(operators.when, 'should offer: const {when} = require(arnie/operators)')
  t.assert(operators.when, 'should offer: const {when} = require(arnie/operators)')
  t.assert(providers.HttpResponseProvider, 'should offer: const {HttpResponseProvider} = require(arnie/providers)')
  t.assert(providers.OutputProvider, 'should offer: const {OutputProvider} = require(arnie/providers)')
  t.assert(providers.ServerlessRequestProvider, 'should offer: const {ServerlessRequestProvider} = require(arnie/providers)')

  const inititalData = {foo: 'bar'}
  const mutation = {foo: 'mutated'}
  const expectedOutput = {
    foo: mutation.foo,
    bar: 'foo'
  }
  const task = [
    ({input}) => {
      t.deepEqual(
        input,
        inititalData,
        'should execute first action with initital input'
      )
      return Promise.resolve(mutation)
    },
    ({input}) => {
      t.deepEqual(
        input,
        mutation,
        'should execute subsequent action with mutated input'
      )
      return {bar: expectedOutput.bar}
    }
  ]

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
