import test from 'tape'
import {
  createTask,
  runTask
} from '../../src/core/task'
import when from '../../src/addons/when'

test('Addon: when()', (t) => {
  t.plan(4)

  const task = createTask([
    when('path.to.propertyA', {
      value: [() => t.pass('should route to path when property has matching value')],
      otherwise: [() => t.fail('should NOT route to this path')]
    }),
    when((ctx) => ctx.path.to.propertyA, {
      value: [() => t.pass('should accept function instead property path')]
    }),
    when('path.to.propertyB', {
      value: [() => t.fail('should NOT route to this path')],
      otherwise: [() => t.pass('should route to otherwise when property has no matching value')]
    }),
    when('path.does.not.exist', {
      otherwise: [() => t.pass('should route to otherwise when property does not exist')]
    })
  ])

  runTask(task, {path: {to: {propertyA: 'value', propertyB: 'foo'}}})
})
