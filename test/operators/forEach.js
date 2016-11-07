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
        num += 1
        t.pass(`should execute a new function-tree for each item ${num}/2`)
        t.assert(!input.localOutput, `should isolate payload of each function-tree ${num}/2`)
        return {localOutput: true}
      }
    ]),
    ({input}) => {
      t.assert(num === 2, 'finish iteration before next action')
      t.assert(!input.localOutput, 'should use isolated payload')
    }
  ]

  const payload = {
    list: [1, 2]
  }
  arnie(task, payload).catch(console.error)
})
