// Just for ease of use when importing
// module.exports = require('./dist').default

module.exports = {
  default: require('./dist').default,
  createTask: require('./dist').createTask,
  runTask: require('./dist').runTask,
  runTasks: require('./dist').runTasks
}
