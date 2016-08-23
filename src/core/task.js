import {PATH_WITHOUT_VALUE} from './symbols'
import check from 'check-types'

export function createTask (definition, task = {actions: []}) {
  if (!Array.isArray(definition)) throw new Error('Task definition should be an array.')

  task.displayName = task.displayName || definition.displayName
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
  let displayName = fn.displayName
  if (!displayName && fn.name) {
    displayName = fn.name
  }

  return {
    fn,
    outputs: {},
    displayName
  }
}

function createOutputs (params) {
  const output = {}
  for (const key in params) {
    output[key] = createTask(params[key])
  }
  return output
}

export async function runTask (task, ctx = {}, ...args) {
  if (!ctx.input) {
    ctx.input = {}
  }
  for (const action of task.actions) {
    try {
      const output = await action.fn(ctx, ...args)
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
            await runTask(outputTask, ctx, ...args)
          }
        }
      }
    } catch (error) {
      if (action.outputs.error) {
        await runTask(action.outputs.error, ctx, ...args)
      } else {
        throw error
      }
    }
  }

  return ctx
}

export async function runTasks (tasks, ctx = {}, ...args) {
  const output = {}
  for (const task of tasks) {
    Object.assign(
      output,
      await runTask(task, ctx, ...args)
    )
  }

  return output
}
