const A = require('arnie')

module.exports.runTask = (task, providers = []) => {
  const arnie = A({
    providers
  })
  return arnie(task)
}
