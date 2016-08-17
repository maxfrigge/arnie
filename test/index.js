import test from 'tape'
import Arnie from '../src'
import {setupKoa, teardownKoa} from './utils/koa'

test('Arnie: getTasks()', (t) => {
  t.plan(1)
  const arnie = Arnie()

  const expected = []
  const actual = arnie.getTasks()

  t.deepEqual(
    actual,
    expected,
    'should return the task list'
  )
})

test('Arnie: addTask()', (t) => {
  t.plan(1)
  const arnie = Arnie()

  const action = () => {}
  const task = [
    action
  ]

  const expected = [{
    displayName: 'taskA',
    actions: [
      {
        displayName: undefined,
        fn: action,
        outputs: {}
      }
    ]
  }]

  const actual = arnie.addTask('taskA', task).getTasks()

  t.deepEqual(
    actual,
    expected,
    'should create and add one task'
  )
})

test('Arnie: addTasks()', (t) => {
  t.plan(1)
  const arnie = Arnie()

  const actionA = () => {}
  const taskA = [
    actionA
  ]
  const actionB = () => {}
  const taskB = [
    actionB
  ]

  const expected = [{
    displayName: 'taskA',
    actions: [
      {
        displayName: undefined,
        fn: actionA,
        outputs: {}
      }
    ]
  }, {
    displayName: 'taskB',
    actions: [
      {
        displayName: undefined,
        fn: actionB,
        outputs: {}
      }
    ]
  }]

  const actual = arnie.addTasks({
    taskA,
    taskB
  }).getTasks()

  t.deepEqual(
    actual,
    expected,
    'should create and add many tasks'
  )
})

test('Arnie: doIt(taskName)', (t) => {
  t.plan(2)
  const arnie = Arnie()

  const action = () => {
    t.pass('should execute the task')
    return {foo: 'bar'}
  }
  const task = [
    action
  ]

  const expectedOutput = {foo: 'bar'}
  arnie
  .addTask('task', task)
  .doIt('task')
  .then((actualOutput) => {
    t.deepEqual(
      actualOutput,
      expectedOutput,
      'should return the task output'
    )
  })
})

test('Arnie: doIt()', (t) => {
  t.plan(3)
  const arnie = Arnie()

  const taskA = [
    () => {
      t.pass('should execute task 1/2')
      return {foo: 'bar'}
    }
  ]
  const taskB = [
    () => {
      t.pass('should execute task 2/2')
      return {bar: 'foo'}
    }
  ]

  const expectedOutput = {foo: 'bar', bar: 'foo'}
  arnie
  .addTasks({
    taskA,
    taskB
  })
  .doIt()
  .then((actualOutput) => {
    t.deepEqual(
      actualOutput,
      expectedOutput,
      'should return the combined task output'
    )
  })
})

test('Arnie: koa()', (t) => {
  t.plan(2)

  const koa = setupKoa()
  const arnie = Arnie()

  const taskA = [
    () => {
      t.pass('should execute task 1/2 on http request')
    }
  ]
  const taskB = [
    () => {
      t.pass('should execute task 2/2 on http request')
    }
  ]

  koa.app.use(
    arnie.koa({
      taskA,
      taskB
    })
  )

  koa.request.get('/').end(() => {
    teardownKoa(koa)
  })
})
