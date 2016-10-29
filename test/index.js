const test = require('tape')
const A = require('../src')
const arnie = A()

test('Arnie', (t) => {
  t.plan(4)

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
