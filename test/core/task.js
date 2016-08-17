import test from 'tape'
import {
  createTask,
  runTask
} from '../../src/core/task'

test('Given a simple task definition, createTask()', (t) => {
  t.plan(1)

  const actionA = () => {}
  actionA.displayName = 'myName'
  function actionB () {}
  const actionC = () => {}

  const expected = {
    displayName: undefined,
    actions: [
      {
        fn: actionA,
        outputs: {},
        displayName: 'myName'
      }, {
        fn: actionB,
        outputs: {},
        displayName: 'actionB'
      }, {
        fn: actionC,
        outputs: {},
        displayName: undefined
      }
    ]
  }
  const actual = createTask([
    actionA,
    actionB,
    actionC
  ])

  t.deepEqual(
    actual,
    expected,
    'should create a valid task'
  )
})

test('Given a task definition with nested arrays, createTask()', (t) => {
  const actionA = () => {}
  const actionB = () => {}
  const actionC = () => {}

  const expected = {
    displayName: undefined,
    actions: [
      {
        fn: actionA,
        outputs: {},
        displayName: undefined
      }, {
        fn: actionB,
        outputs: {},
        displayName: undefined
      }, {
        fn: actionC,
        outputs: {},
        displayName: undefined
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

  t.deepEqual(
    actual,
    expected,
    'should create a valid task'
  )
  t.end()
})

test('Given a task definition with outputs, createTask()', (t) => {
  const actionA = () => {}
  const actionB = () => {}
  const actionC = () => {}

  const expected = {
    displayName: undefined,
    actions: [
      {
        fn: actionA,
        displayName: undefined,
        outputs: {}
      }, {
        fn: actionB,
        displayName: undefined,
        outputs: {
          actionBOutputA: {
            displayName: undefined,
            actions: [
              {
                fn: actionA,
                displayName: undefined,
                outputs: {}
              },
              {
                fn: actionB,
                displayName: undefined,
                outputs: {}
              }
            ]
          },
          actionBOutputB: {
            displayName: undefined,
            actions: [{
              fn: actionC,
              displayName: undefined,
              outputs: {}
            }]
          }
        }
      }, {
        fn: actionC,
        displayName: undefined,
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

  t.deepEqual(
    actual,
    expected,
    'should create a valid task'
  )
  t.end()
})

test('Given a complex task definition, createTask()', (t) => {
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
    displayName: undefined,
    actions: [
      {
        fn: actionA,
        displayName: undefined,
        outputs: {}
      }, {
        fn: actionB,
        displayName: undefined,
        outputs: {
          actionBOutputA: {
            displayName: undefined,
            actions: [
              {
                fn: actionA,
                displayName: undefined,
                outputs: {}
              }
            ]
          },
          actionBOutputB: {
            displayName: undefined,
            actions: [
              {
                fn: actionB,
                displayName: undefined,
                outputs: {
                  subTaskBOutputA: {
                    displayName: undefined,
                    actions: [
                      {
                        fn: actionA,
                        displayName: undefined,
                        outputs: {}
                      }
                    ]
                  },
                  subTaskBOutputB: {
                    displayName: undefined,
                    actions: [
                      {
                        fn: actionB,
                        displayName: undefined,
                        outputs: {}
                      },
                      {
                        fn: actionC,
                        displayName: undefined,
                        outputs: {}
                      }
                    ]
                  }
                }
              },
              {
                fn: actionC,
                displayName: undefined,
                outputs: {}
              }
            ]
          }
        }
      },
      {
        fn: actionC,
        displayName: undefined,
        outputs: {}
      }
    ]
  }

  const actual = createTask(mainTask)

  t.deepEqual(
    actual,
    expected,
    'should create a valid task'
  )
  t.end()
})

test('Given a complex task, runTask()', (t) => {
  t.plan(9)

  let actionNum = 0
  const shouldNotRun = () => t.fail('should NOT run this action')
  const shouldRun = (order, output) => {
    return (ctx) => {
      t.equal(
        actionNum += 1,
        order,
        `should run each action in sequential order (${order})`
      )
      return output
    }
  }
  const shouldRunWithInput = (order, expectedInput, output) => {
    return (ctx) => {
      t.equal(
        actionNum += 1,
        order,
        `should run each action in sequential order (${order})`
      )
      t.deepEqual(
        ctx.input,
        expectedInput,
        'should receive merged input'
      )

      return output
    }
  }

  const task = createTask([
    shouldRunWithInput(1, {initialInput: 'foo'}, {newData: 123}), {
      newData: [
        shouldRun(2), {
          testA: [shouldNotRun]
        },
        shouldRun(3, {someOutput: '123'}), {
          someOutput: [
            shouldRunWithInput(4, {initialInput: 'foo', newData: 123, someOutput: '123'}, {initialInput: 'changedFoo'})
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
    shouldRunWithInput(5, {initialInput: 'changedFoo', newData: 123, someOutput: '123'})
  ])

  runTask(task, {input: {initialInput: 'foo'}})
  .then((ctx) => t.pass('should complete'))
})
