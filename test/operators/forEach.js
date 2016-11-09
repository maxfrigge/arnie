const test = require('tape')
const A = require('../../src')
const arnie = A()
const forEach = require('../../src/operators/forEach')

test('Operator: forEach', (t) => {
  t.plan(6)

  let num = 0
  const task = [
    forEach('input:list', 'item', [
      ({input}) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            num += 1
            t.pass(`should execute a new function-tree for iteration ${num}/2`)
            t.assert(input.deep.param.value === 1, `should use isolated payload for iteration ${num}/2`)
            input.deep.param.value += 1
            resolve(input)
          }, Math.random() * 300 + 50)
        })
      }
    ]),
    ({input}) => {
      t.assert(num === 2, 'finish iteration before next action')
      t.assert(input.deep.param.value === 1, 'should use isolated payload')
    }
  ]

  const payload = {
    list: [1, 2],
    deep: {param: {value: 1}}
  }
  arnie(task, payload).catch(console.error)
})
