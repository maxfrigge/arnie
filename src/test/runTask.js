const A = require('arnie')

function runTask (task, providers = []) {
  const arnie = A({
    providers
  })
  return arnie(task)
}

module.exports = runTask
