const get = require('get-value')

module.exports = (test) => {
  return function when (ctx) {
    const value = getValue(ctx, test)
    const path = getPath(ctx, value)
    if (typeof path !== 'function') {
      const paths = Object.keys(ctx.path).join(', ')
      throw new Error(`Could not find a matching path for value "${value}" in paths: ${paths}`)
    }

    return path()
  }
}

function isTruthy (path) {
  return path.hasOwnProperty('true') || path.hasOwnProperty('false')
}

function getValue (ctx, test) {
  if (typeof test === 'function') {
    return test(ctx)
  }

  return get(ctx, test.replace(':', '.'))
}

function getPath (ctx, value) {
  const truthy = isTruthy(ctx.path)
  if (truthy) {
    return value ? ctx.path.true : ctx.path.false
  }
  if (ctx.path[value]) {
    return ctx.path[value]
  }

  return ctx.path.otherwise
}
