const FunctionTree = require('function-tree').default

module.exports = (props) => {
  const runTask = FunctionTree()
  // TODO: Addd default context provider
  return (task, payload) => {
    return new Promise((resolve, reject) => {
      const onEnd = (execution, payload) => {
        runTask.off('error', onError)
        resolve(payload)
      }
      const onError = (error, execution, payload) => {
        runTask.off('end', onEnd)
        reject(error)
      }
      runTask.once('end', onEnd)
      runTask.once('error', onError)
      runTask(task, payload)
    })
  }
}
