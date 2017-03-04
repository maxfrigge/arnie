const t = require('tap')
const A = require('../../src')
const HttpReponse = require('../../src/providers/http-response')
const arnie = A({
  providers: [HttpReponse()]
})

t.test('Provider: HttpReponse', (t) => {
  t.plan(2)

  arnie([
    ({response}) => {
      response.body = {foo: 'bar'}
    }
  ])
  .catch(console.error)
  .then((result) => {
    t.deepEqual(result.response, {
      statusCode: 200,
      statusMessage: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      body: {foo: 'bar'}
    }, 'should provide an api to create a json response')
  })

  arnie([
    ({response}) => {
      response.body = 'text'
    }
  ])
  .catch(console.error)
  .then((result) => {
    t.deepEqual(result.response, {
      statusCode: 200,
      statusMessage: 'OK',
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '4'
      },
      body: 'text'
    }, 'should provide an api to create a text response')
  })
})
