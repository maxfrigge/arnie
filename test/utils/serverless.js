module.exports.setupServerless = (functions) => {
  return {
    request: (options, callback) => {
      const fn = functions[options.path]
      if (typeof fn !== 'function') {
        throw new Error(`No function for path ${options.path} defined!`)
      }
      fn(
        createEvent(options),
        createContext(),
        callback
      )
    }
  }
}

function createEvent (options) {
  return {
    method: options.method,
    path: options.path,
    headers: {}
  }
}

function createContext () {
  return {}
}
