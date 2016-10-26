const A = require('../')

module.exports = (config) => {
  const arnie = A(config)
  return (task) => {
    return (event, context, cb) => {
      const input = createInput(event, context)
      arnie(task, input)
        // TODO: Transorm reponse from arnie stanard ouput to serverless
        .then((result) => {
          if (typeof context.succeed === 'function') {
            context.succeed(result.res)
          }
          cb(null, result.res)
        })
        .catch((error) => {
          cb(error, null)
        })
    }
  }
}

// TODO: Settle on arnie stanard input e.g. req
function createInput (event, context) {
  return {
    aws: {
      event,
      context
    },
    req: {
      headers: event.headers,
      method: event.method,
      url: event.path // TODO: pass the complete url if possible
    },
    res: {
      headers: {},
      statusCode: undefined,
      statusMessage: 200,
      body: undefined
    }
  }
}
