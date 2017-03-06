const FunctionTree = require('function-tree').default

module.exports = (options = {}) => {
  // TODO: Addd default context provider
  return (task, payload) => {
    // TODO: factory should only be called once! This requires refactor from https://github.com/cerebral/cerebral/issues/710
    const runTask = FunctionTree(options.providers)
    return new Promise((resolve, reject) => {
      const onEnd = (execution, result) => {
        runTask.off('error', onError)
        resolve(result)
      }
      const onError = (error, execution, payload) => {
        runTask.off('end', onEnd)
        reject(error)
      }
      runTask.once('end', onEnd)
      runTask.once('error', onError)
      runTask(task, payload || {})
    })
  }
}

module.exports.sequence = require('function-tree').sequence
module.exports.parallel = require('function-tree').parallel
