const t = require('tap')
const A = require('../')
const arnie = A()
const when = require('./when')
const props = require('../tags/props')

t.test('Operator: when', (t) => {
  t.plan(5)

  const task = [
    when(({props}) => props.path.truthy), {
      true: [
        () => {
          t.pass('should trigger path "true" when truthy')
        }
      ],
      false: [
        () => {
          t.fail('should NOT trigger this path')
        }
      ]
    },
    when(props`path.falsy`), {
      true: [
        () => {
          t.fail('should NOT trigger this path')
        }
      ],
      false: [
        () => {
          t.pass('should trigger path "false" when falsy')
        }
      ]
    },
    when(({props}) => props.path.number > 5), {
      true: [
        () => {
          t.pass('should evaluate function to true or false path')
        }
      ],
      false: [
        () => {
          t.fail('should NOT trigger this path')
        }
      ]
    },
    when(props`path.foo`), {
      bar: [
        () => {
          t.pass('should trigger path where path name matches value')
        }
      ],
      otherwise: [
        () => {
          t.fail('should NOT trigger this path')
        }
      ]
    },
    when(props`path.bar`), {
      foo: [
        () => {
          t.fail('should NOT trigger this path')
        }
      ],
      otherwise: [
        () => {
          t.pass('should trigger path "otherwise" if path with value is not set')
        }
      ]
    }
  ]

  const payload = {
    path: {
      truthy: 1,
      falsy: null,
      foo: 'bar',
      number: 10,
      bar: 'something-else'
    }
  }
  arnie(task, payload).catch(console.error)
})
