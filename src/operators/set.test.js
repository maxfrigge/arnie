const t = require('tap')
const A = require('../')
const arnie = A()
const set = require('./set')
const input = require('../tags/input')

t.test('Operator: set', (t) => {
  t.plan(1)

  const task = [
    set(({input}, value) => {
      input.foo = value
    }, '100'),
    set(input`another.target`, input`foo`),
    set(input`yet.another.target`, ({input}) => parseInt(input.foo, 10) * 2)
  ]

  const expectedResult = {
    foo: '100',
    another: {target: '100'},
    yet: {another: {target: 200}}
  }
  arnie(task)
    .then((result) => {
      t.deepEqual(result, expectedResult, 'should mutate the context')
    })
    .catch(console.error)
})
