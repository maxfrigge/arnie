const FunctionTree = require('./function-tree').default

module.exports = (options = {}) => {
  // TODO: Addd default context provider
  const runTask = FunctionTree(options.providers)
  return (task, payload) => {
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
