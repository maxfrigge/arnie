import {
  createTask,
  runTask
} from './task'

export default function middleware (taskDefinitions) {
  const tasks = Object
  .keys(taskDefinitions)
  .map((key) => createTask(taskDefinitions[key]))

  return async (ctx, next) => {
    for (const task of tasks) {
      await runTask(task, ctx, next)
    }
    next()
  }
}

// import pathToRegexp from 'path-to-regexp'
// const keys = []
// const re = pathToRegexp(path, keys)
// const match = re.exec(ctx.path)
// if (match) {
//   const parseUrlParam = (params, value, index) => {
//     const key = keys[index].name
//     params[key] = value
//     return params
//   }
//   const decodeParam = (param) => {
//     if (param !== undefined) {
//       return decodeURIComponent(param)
//     }
//
//     return param
//   }
//
//   const initialInput = match
//   .slice(1)
//   .map(decodeParam)
//   .reduce(parseUrlParam, {})
//
//   await executeTree(actionTree.tree, actionTree.actions, ctx, initialInput)
// }
