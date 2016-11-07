module.exports = (options) => {
  return (context, functionDetails, payload) => {
    context.output = (data) => {
      const pathFn = getPathFn(context.path, data)
      if (pathFn) {
        return pathFn(data)
      }
      return data
    }
    return context
  }
}

function getPathFn (path, output) {
  if (!path) {
    return
  }
  for (const key in output) {
    if (path[key]) {
      return path[key]
    }
  }
}
