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
    ({props, output}) => {
      t.deepEqual(props, {test: 'path-not-defined'}, 'should return output when no matching path defined')
      return output({test: 'path-defined'})
    }, {
      test: [
        ({props}) => {
          t.deepEqual(props, {test: 'path-defined'}, 'should trigger path when defined')
        }
      ]
    }
  ])
  .catch(console.error)
})
