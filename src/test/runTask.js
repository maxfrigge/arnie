const A = require('arnie')

function runTask (task, providers = [], payload = {}) {
  const arnie = A({
    providers
  })
  return arnie(task, payload)
}

module.exports = runTask
