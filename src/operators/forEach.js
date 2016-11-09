const A = require('../')
const get = require('get-value')
const set = require('set-value')

module.exports = (valueTemplate, inputPath, task) => {
  return function forEach (ctx) {
    const providers = ctx.execution.functionTree.contextProviders
    const items = getValue(ctx, valueTemplate)
    const promises = items.map(
      (item) => {
        const payload = JSON.parse(JSON.stringify(ctx.input))
        set(payload, inputPath, item)
        return execute(providers, payload, task)
      }
    )
    return Promise
      .all(promises)
      .then((result) => {
        // Don't merge result back for now
        return
      })
  }
}

function execute (providers, payload, task) {
  const arnie = A({
    providers
  })
  return arnie(task, payload)
}

function isContextPath (value) {
  const regexp = /^[a-z]+:/gi
  return regexp.test(value)
}

function getValue (ctx, path) {
  if (typeof path === 'function') {
    path = path(ctx)
  }
  if (isContextPath(path)) {
    return get(ctx, path.replace(':', '.'))
  }
  if (typeof path === 'string') {
    return path.replace(/\\:/g, ':')
  }
  return path
}
