import when from './when'

export default (...args) => {
  let paths, contentTypes

  if (Array.isArray(args[0])) {
    contentTypes = args[0]
    paths = args[0].reduce((paths, key) => {
      paths[key] = []
      return paths
    }, args[1])
  } else {
    contentTypes = Object.keys(args[0])
    paths = args[0]
  }
  return when((ctx) => {
    return ctx.request.accepts(contentTypes)
  }, paths)
}
