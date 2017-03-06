const t = require('tap')
const A = require('../')
const arnie = A()
const set = require('./set')
const props = require('../tags/props')

t.test('Operator: set', (t) => {
  t.plan(1)

  const task = [
    set(({props}, value) => {
      props.foo = value
    }, '100'),
    set(props`another.target`, props`foo`),
    set(props`yet.another.target`, ({props}) => parseInt(props.foo, 10) * 2)
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
