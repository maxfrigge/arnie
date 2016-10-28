const A = require('../')
// TODO: Create a KOA request provider
const KoaRequestProvider = require('../providers/koa-request')
const HttpResponseProvider = require('../providers/http-response')

module.exports = (options) => {
  // TODO: Allow passing additional providers and options
  const arnie = A({
    providers: [
      HttpResponseProvider(),
      KoaRequestProvider()
    ]
  })
  return (task) => {
    return (ctx) => {
      // We could hide the payload and only pass it to provider factories
      const payload = createPayload(ctx)
      return arnie(task, payload)
        .then((result) => {
          addToContext(ctx, result)
          return result
        })
        .catch((error) => {
          // TODO: Is there anything we should do with the error? e.g. ctx.error(error)
          throw error
        })
    }
  }
}

function createPayload (ctx) {
  return {
    koa: ctx
  }
}

function addToContext (ctx, result) {
  // TODO: Copy fields from result to koa
}
