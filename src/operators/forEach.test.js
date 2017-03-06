const t = require('tap')
const A = require('../')
const arnie = A()
const props = require('../tags/props')
const forEach = require('./forEach')

t.test('Operator: forEach', (t) => {
  t.plan(8)

  let num = 0
  const task = [
    forEach(props`list`, 'item', [
      ({props}) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            num += 1
            t.assert(props.item, 'should pass iterated object')
            t.pass(`should execute a new function-tree for iteration ${num}/2`)
            t.assert(props.deep.param.value === 1, `should use isolated payload for iteration ${num}/2`)
            props.deep.param.value += 1
            resolve(props)
          }, (Math.random() * 300) + 50)
        })
      }
    ]),
    ({props}) => {
      t.assert(num === 2, 'finish iteration before next action')
      t.assert(props.deep.param.value === 1, 'should use isolated payload')
    }
  ]

  const payload = {
    list: [1, 2],
    deep: {param: {value: 1}}
  }
  arnie(task, payload).catch(console.error)
})
