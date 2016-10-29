const test = require('tape')
const A = require('../../src')
const arnie = A()
const set = require('../../src/operators/set')

test('Operator: set', (t) => {
  t.plan(1)

  const task = [
    set('input:path.to.target', '100'),
    set('input:another.target', 'input:path.to.target'),
    set('input:yet.another.target', ({input}) => parseInt(input.path.to.target, 10) * 2)
  ]

  const expectedResult = {
    path: {to: {target: '100'}},
    another: {target: '100'},
    yet: {another: {target: 200}}
  }
  arnie(task)
    .then((result) => {
      t.deepEqual(result, expectedResult, 'should mutate the context')
    })
    .catch(console.error)
})
