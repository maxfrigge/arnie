import middleware from 'core/middleware'
import {createTask} from 'core/task'

export default function Arnie (config = {}) {
  const myTasks = []

  const addTask = (task) => myTasks.push(createTask(task))
  const addTasks = (tasks) => tasks.forEach(addTask)
  const getTasks = () => myTasks
  const doIt = () => middleware(myTasks, config)

  return {
    addTask,
    addTasks,
    getTasks,
    doIt
  }
}
