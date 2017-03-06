// TODO: Refactor to use tags!

const A = require('../')
const set = require('set-value')

module.exports = (propsTag, outputPath, task) => {
  return function forEach (ctx) {
    const providers = ctx.execution.functionTree.contextProviders
    const items = getValue(ctx, propsTag)
    const promises = items.map(
      (item) => {
        const payload = JSON.parse(JSON.stringify(ctx.props))
        set(payload, outputPath, item)
        return execute(providers, payload, task)
      }
    )
    return Promise
      .all(promises)
      .then((result) => undefined) // Don't merge output back
  }
}

function execute (providers, payload, task) {
  const arnie = A({
    providers
  })
  return arnie(task, payload)
}

function getValue (ctx, resolver) {
  if (typeof resolver === 'function') {
    return resolver(ctx)
  }
  if (typeof resolver === 'object') {
    return resolver.getValue(ctx)
  }

  return resolver
}
