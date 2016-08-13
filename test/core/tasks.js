import test from 'tape'
import {
  createTask,
  runTask
} from '../../src/core/tasks'

test('Create task from flat task definition.', (assert) => {
  const actionA = () => {}
  const actionB = () => {}
  const actionC = () => {}

  const expected = {
    actions: [
      {
        fn: actionA,
        outputs: {}
      }, {
        fn: actionB,
        outputs: {}
      }, {
        fn: actionC,
        outputs: {}
      }
    ]
  }
  const actual = createTask([
    actionA,
    actionB,
    actionC
  ])

  assert.deepEqual(
    actual,
    expected,
    'Given a flat task definition, createTask() should create a valid task.'
  )
  assert.end()
})

test('Create flat task from nested arrays in task definition.', (assert) => {
  const actionA = () => {}
  const actionB = () => {}
  const actionC = () => {}

  const expected = {
    actions: [
      {
        fn: actionA,
        outputs: {}
      }, {
        fn: actionB,
        outputs: {}
      }, {
        fn: actionC,
        outputs: {}
      }
    ]
  }
  const actual = createTask([
    actionA,
    [
      actionB,
      [
        actionC
      ]
    ]
  ])

  assert.deepEqual(
    actual,
    expected,
    'Given a flat task definition, createTask() should create a valid task.'
  )
  assert.end()
})

test('Create a simple task with outputs.', (assert) => {
  const actionA = () => {}
  const actionB = () => {}
  const actionC = () => {}

  const expected = {
    actions: [
      {
        fn: actionA,
        outputs: {}
      }, {
        fn: actionB,
        outputs: {
          actionBOutputA: {
            actions: [
              {
                fn: actionA,
                outputs: {}
              },
              {
                fn: actionB,
                outputs: {}
              }
            ]
          },
          actionBOutputB: {
            actions: [{
              fn: actionC,
              outputs: {}
            }]
          }
        }
      }, {
        fn: actionC,
        outputs: {}
      }
    ]
  }
  const actual = createTask([
    actionA,
    actionB, {
      actionBOutputA: [
        actionA,
        actionB
      ],
      actionBOutputB: [
        actionC
      ]
    },
    actionC
  ])

  assert.deepEqual(
    actual,
    expected,
    'Given a task definition with outputs, createTask() should create a valid task.'
  )
  assert.end()
})

test('Create a complex task from nested definitions.', (assert) => {
  const actionA = () => {}
  const actionB = () => {}
  const actionC = () => {}

  const subTaskA = [
    actionA
  ]
  const subTaskB = [
    actionB, {
      subTaskBOutputA: [
        actionA
      ],
      subTaskBOutputB: [
        actionB,
        actionC
      ]
    },
    actionC
  ]
  const mainTask = [
    actionA,
    actionB, {
      actionBOutputA: subTaskA,
      actionBOutputB: subTaskB
    },
    actionC
  ]

  const expected = {
    actions: [
      {
        fn: actionA,
        outputs: {}
      }, {
        fn: actionB,
        outputs: {
          actionBOutputA: {
            actions: [
              {
                fn: actionA,
                outputs: {}
              }
            ]
          },
          actionBOutputB: {
            actions: [
              {
                fn: actionB,
                outputs: {
                  subTaskBOutputA: {
                    actions: [
                      {
                        fn: actionA,
                        outputs: {}
                      }
                    ]
                  },
                  subTaskBOutputB: {
                    actions: [
                      {
                        fn: actionB,
                        outputs: {}
                      },
                      {
                        fn: actionC,
                        outputs: {}
                      }
                    ]
                  }
                }
              },
              {
                fn: actionC,
                outputs: {}
              }
            ]
          }
        }
      },
      {
        fn: actionC,
        outputs: {}
      }
    ]
  }

  const actual = createTask(mainTask)

  assert.deepEqual(
    actual,
    expected,
    'Given a deeply nested task definition, createTask() should create a valid task.'
  )
  assert.end()
})

test('Run a simple task and pass input along.', (assert) => {
  assert.plan(3)
  const actionA = (ctx) => {
    assert.equal(
      ctx.input.initialInput,
      'foo'
    )

    return {
      moreInput: 'bar'
    }
  }
  const actionB = (ctx) => {
    assert.equal(
      ctx.input.moreInput,
      'bar'
    )
  }

  const task = createTask([
    actionA,
    actionB
  ])

  runTask(task, {input: {initialInput: 'foo'}})
  .then((ctx) => {
    assert.deepEqual(
      ctx.input,
      {initialInput: 'foo', moreInput: 'bar'}
    )
  })
})

test('Run a complex task with paths and nesting.', (assert) => {
  assert.plan(6)
  const actionA = (ctx) => {
    assert.pass('run action')
    return {takeThisPath: true}
  }
  const actionB = (ctx) => {
    assert.deepEqual(
      ctx.input,
      {initialInput: 'foo', takeThisPath: true, nestedOutput: true}
    )

    return {
      initialInput: 'changedFoo'
    }
  }
  const shouldRun = async (ctx) => {
    assert.pass('run async action')

    return {nestedOutput: true}
  }
  const shouldNotRun = (ctx) => {
    assert.fail('should not action')
  }

  const task = createTask([
    actionA, {
      takeThisPath: [
        shouldRun, {
          testA: [shouldNotRun]
        },
        actionA, {
          takeThisPath: [
            shouldRun
          ],
          dontTakeThisPath: [
            shouldNotRun
          ]
        }
      ],
      dontTakeThisPath: [
        shouldNotRun
      ]
    },
    actionB
  ])

  runTask(task, {input: {initialInput: 'foo'}})
  .then((ctx) => {
    assert.deepEqual(
      ctx.input,
      {initialInput: 'changedFoo', takeThisPath: true, nestedOutput: true}
    )
  })
})
