const supertest = require('supertest')
const url = require('url')

module.exports.setupServerless = (functions) => {
  // console.log('Setup serverless')
  const request = supertest.agent((req, res) => {
    // console.log('SLS: request', req, res)
    const awsEvent = createEvent(req)
    const awsContext = createContext()
    const fn = functions[awsEvent.path]
    // console.log('SLS: parsed', awsEvent, awsContext, fn)
    if (typeof fn !== 'function') {
      throw new Error(`No function for path ${awsEvent.path} defined!`)
    }
    fn(awsEvent, awsContext, (error, response) => {
      //  console.log('SLS: callback', error, response)
      if (error) {
        res.writeHead(500)
        res.end(error.message)
        return
      }

      res.writeHead(response.statusCode, response.headers)
      res.end(response.body)
    })
  })

  return {
    request
  }
}

function createEvent (req) {
  return {
    httpMethod: req.method,
    path: url.parse(req.url).path,
    headers: req.headers
  }
}

function createContext () {
  return {}
}
