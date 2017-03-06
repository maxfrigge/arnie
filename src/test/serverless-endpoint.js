const supertest = require('supertest')
const url = require('url')
const qs = require('qs')
const pathToRegexp = require('path-to-regexp')

function ServerlessEndpoint (routes) {
  const router = createRouter(routes)
  const endpoint = createTestEndpoint(router)

  return endpoint
}

function createTestEndpoint (router) {
  const endpoint = supertest.agent((request, res) => {
    var body = []
    request
      .on('data', (chunk) => {
        body.push(chunk)
      })
      .on('end', function () {
        body = Buffer.concat(body).toString()

        const awsEvent = createEvent(request, body)
        const awsContext = createContext()

        const route = router.get(awsEvent.path)
        awsEvent.pathParameters = route.params

        route.handler(awsEvent, awsContext, (error, response) => {
          if (error) {
            res.statusCode = 500
            res.end()
            return
          }

          res.writeHead(response.statusCode, response.headers)
          res.end(response.body)
        })
      })
  })

  return endpoint
}

function createRouter (routes) {
  const routeSpecs = Object
    .keys(routes)
    .map((route) => {
      const keys = []
      return {
        route,
        keys,
        handler: routes[route],
        re: pathToRegexp(route, keys)
      }
    })

  return {
    get (path) {
      for (const spec of routeSpecs) {
        const result = spec.re.exec(path)
        if (result) {
          const handler = spec.handler
          const params = result
            .slice(1)
            .reduce((params, value, index) => {
              const param = spec.keys[index]
              params[param.name] = value
              return params
            }, {})

          return {
            params,
            handler
          }
        }
      }

      throw new Error(`No route for path ${path} defined!`)
    }
  }
}

function createEvent (req, body) {
  const urlSpecs = url.parse(req.url)

  return {
    httpMethod: req.method,
    path: urlSpecs.pathname,
    headers: req.headers,
    queryStringParameters: qs.parse(urlSpecs.query),
    body: body
  }
}

function createContext () {
  return {}
}

module.exports = ServerlessEndpoint
