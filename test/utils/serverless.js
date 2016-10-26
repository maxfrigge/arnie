module.exports.setupServerless = (functions) => {
  return {
    request: (path, callback) => {
      const fn = functions[path]
      if (typeof fn !== 'function') {
        throw new Error(`No function for path ${path} defined!`)
      }
      fn(
        createEvent(path),
        createContext(),
        callback
      )
    }
  }
}

function createEvent (path) {
  return {
    path
  }
}

function createContext () {
  return {}
}
