import middleware from './core/middleware'
import {createTask, runTask, runTasks} from './core/task'

export {
  createTask,
  runTask,
  runTasks
}

export default function Arnie (config = {}) {
  const myTasks = []

  const arnie = {
    getTasks: () => myTasks
  }

  arnie.addTask = (...args) => {
    let name, task
    switch (args.length) {
      case 2:
        name = args[0]
        task = args[1]
        break
      case 1:
        task = args[0]
        break
      default:
        throw new Error('Invalid call to addTask(). Use addTask([name,] task).')
    }

    task.displayName = task.displayName || name
    myTasks.push(createTask(task))

    return arnie
  }

  arnie.addTasks = (tasks) => {
    Object
    .keys(tasks)
    .forEach(
      (name) => arnie.addTask(name, tasks[name])
    )

    return arnie
  }

  arnie.doIt = async (...args) => {
    let result = {}
    switch (args.length) {
      case 1:
        const task = myTasks.find((task) => task.displayName === args[0])
        if (!task) {
          throw new Error(`Task ${args[0]} not found.`)
        }
        result = await runTask(task)
        break
      case 0:
        result = await runTasks(myTasks)
        break
      default:
        throw new Error('Invalid call to doIt(). Use doIt(task).')
    }

    return result.input
  }

  arnie.koa = (tasks) => {
    return middleware(tasks, config)
  }

  return arnie
}
