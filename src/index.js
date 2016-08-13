import middleware from 'core/middleware'
import {createTask, runTask} from 'core/tasks'

export default function Arnie (params = {}) {
  const myTasks = []

  const addTask = (task) => myTasks.push(createTask(task))
  const addTasks = (tasks) => tasks.forEach(addTask)
  const getTasks = () => myTasks
  const doIt = () => middleware(myTasks)
  const doItNow = (task) => runTask(createTask(task))

  return {
    addTask,
    addTasks,
    getTasks,
    doIt,
    doItNow
  }
}
