const t = require('tap')
const A = require('../')
const Output = require('./output')

const arnie = A({
  providers: [Output()]
})

t.test('Provider: Output', (t) => {
  t.plan(2)

  arnie([
    ({output}) => {
      return output({test: 'path-not-defined'})
    },
    ({input, output}) => {
      t.deepEqual(input, {test: 'path-not-defined'}, 'should return output when no matching path defined')
      return output({test: 'path-defined'})
    }, {
      test: [
        ({input}) => {
          t.deepEqual(input, {test: 'path-defined'}, 'should trigger path when defined')
        }
      ]
    }
  ])
  .catch(console.error)
})
