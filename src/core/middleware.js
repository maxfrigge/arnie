import {
  createTask,
  runTask
} from './task'

export default function middleware (taskDefinitions, config = {}) {
  const tasks = Object
  .keys(taskDefinitions)
  .map((key) => createTask(taskDefinitions[key]))

  return async (ctx, next) => {
    ctx.arnie = config
    for (const task of tasks) {
      await runTask(task, ctx, next)
    }
  }
}
