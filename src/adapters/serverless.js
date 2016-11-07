const A = require('../')
const ServerlessRequestProvider = require('../providers/serverless-request')
const HttpResponseProvider = require('../providers/http-response')
const OutputProvider = require('../providers/output')

module.exports = (options = {}) => {
  const providers = [
    HttpResponseProvider(),
    ServerlessRequestProvider(),
    OutputProvider()
  ]

  if (Array.isArray(options.providers)) {
    providers.push(...options.providers)
  }

  const arnie = A({
    providers
  })

  return (task) => {
    return (event, context, cb) => {
      // We could hide the payload and only pass it to provider factories
      const payload = createPayload(event, context)
      return arnie(task, payload)
        .then((result) => {
          cb(null, createResponse(result))
        })
        .catch((error) => {
          // TODO: Find a better way to make errors visible
          // console.error(error)
          cb(error, null)
        })
    }
  }
}

function createPayload (event, context) {
  // TODO: Consider removing functions from event/context
  return {
    serverless: {
      aws: {
        event,
        context
      }
    }
  }
}

function createResponse (result) {
  const response = {
    statusCode: result.response.statusCode,
    headers: result.response.headers,
    body: result.response.body
  }
  if (typeof response.body === 'object') {
    try {
      response.body = JSON.stringify(response.body)
    } catch (error) {
      console.warn(`Unable to stringify response body as json: ${error.message}`)
      response.body = undefined
    }
  }
  return response
}
