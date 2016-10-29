const test = require('tape')
const A = require('../../src')
const arnie = A()
const when = require('../../src/operators/when')

test('Operator: when', (t) => {
  t.plan(5)

  const task = [
    when('input:path.truthy'), {
      true: [
        () => t.pass('should trigger path "true" when truthy')
      ],
      false: [
        () => t.fail('should NOT trigger this path')
      ]
    },
    when('input:path.falsy'), {
      true: [
        () => t.fail('should NOT trigger this path')
      ],
      false: [
        () => t.pass('should trigger path "false" when falsy')
      ]
    },
    when(({input}) => input.path.number > 5), {
      true: [
        () => t.pass('should evaluate function to true or false path')
      ],
      false: [
        () => t.fail('should NOT trigger this path')
      ]
    },
    when('input:path.foo'), {
      bar: [
        () => t.pass('should trigger path where path name matches value')
      ],
      otherwise: [
        () => t.fail('should NOT trigger this path')
      ]
    },
    when('input:path.bar'), {
      foo: [
        () => t.fail('should NOT trigger this path')
      ],
      otherwise: [
        () => t.pass('should trigger path "otherwise" if path with value is not set')
      ]
    }
  ]

  const payload = {
    path: {
      truthy: 'true',
      falsy: null,
      foo: 'bar',
      number: 10,
      bar: 'something-else'
    }
  }
  arnie(task, payload).catch(console.error)
})
