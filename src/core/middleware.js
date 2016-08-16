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
  }
}
