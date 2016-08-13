export default function whenMethod (config) {
  const paths = {}

  function parseMethod (ctx) {
    return {
      [ctx.method]: true
    }
  }

  for (const method in config) {
    paths[method.toUpperCase()] = config[method]
  }

  return [
    parseMethod,
    paths
  ]
}
