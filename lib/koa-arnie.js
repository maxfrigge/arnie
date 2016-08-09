import pathToRegexp from 'path-to-regexp'
import { staticTree } from 'action-tree'

function action (path, actions) {
  const keys = []
  const re = pathToRegexp(path, keys)
  const actionTree = staticTree(actions)

  return async (ctx, next) => {
    const match = re.exec(ctx.path)

    if (match) {
      const parseUrlParam = (params, value, index) => {
        const key = keys[index].name
        params[key] = value
        return params
      }
      const decodeParam = (param) => {
        if (param !== undefined) {
          return decodeURIComponent(param)
        }

        return param
      }

      const initialInput = match
      .slice(1)
      .map(decodeParam)
      .reduce(parseUrlParam, {})

      await executeTree(actionTree.tree, actionTree.actions, ctx, initialInput)
    }

    next()
  }
}

async function executeTree (branches, actions, ctx, input) {
  for (const branch of branches) {
    // @TODO: Support nested arrays for parallel execution
    const action = actions[branch.actionIndex]
    const result = await action(ctx, input)
    Object.assign(input, result)

    for (const path in branch.outputs) {
      if (path in result) {
        const outputBranches = branch.outputs[path]
        await executeTree(outputBranches, actions, ctx, input)
      }
    }
  }

  return ctx
}

export default {
  action
}
