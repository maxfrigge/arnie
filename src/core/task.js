import {PATH_WITHOUT_VALUE} from './symbols'
import check from 'check-types'

export function createTask (definition, task = {actions: []}) {
  if (!Array.isArray(definition)) throw new Error('Task definition should be an array.')

  const lastAction = () => task.actions[task.actions.length - 1]
  definition.forEach((item, index) => {
    if (check.array(item)) {
      createTask(item, task)
    } else if (check.function(item)) {
      task.actions.push(
        createAction(item)
      )
    } else if (check.object(item)) {
      if (!task.actions.length) throw new Error('Outputs should be defined right after an action.')
      Object.assign(
        lastAction().outputs,
        createOutputs(item)
      )
    } else {
      throw new Error('Task definition can only contain functions, objects, arrays')
    }
  })

  return task
}

function createAction (fn) {
  return {
    fn,
    outputs: {}
  }
}

function createOutputs (params) {
  const output = {}
  for (const key in params) {
    output[key] = createTask(params[key])
  }
  return output
}

export async function runTask (task, ctx = {}, next = () => {}) {
  if (!ctx.input) {
    ctx.input = {}
  }
  for (const action of task.actions) {
    const output = await action.fn(ctx, next)
    if (output) {
      for (const key in output) {
        const value = output[key]
        if (value !== PATH_WITHOUT_VALUE) {
          ctx.input[key] = value
        }
      }

      for (const path in action.outputs) {
        if (path in output) {
          const outputTask = action.outputs[path]
          await runTask(outputTask, ctx, next)
        }
      }
    }
  }

  return ctx
}
