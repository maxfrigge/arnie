const test = require('tape')
const A = require('../../src')
const ServerlessRequest = require('../../src/providers/serverless-request')
const arnie = A({
  providers: [ServerlessRequest()]
})

test('Provider: ServerlessRequest', (t) => {
  t.plan(10)

  const payload = {
    serverless: {
      aws: {
        event: {
          path: '/health',
          httpMethod: 'GET',
          headers:
           { 'Accept': 'application/json',
             'Accept-Encoding': 'gzip, deflate, sdch, br',
             'Content-Type': 'application/json',
             'Transfer-Encoding': 'application/json',
             'Host': 'thal9f3ckh.execute-api.eu-central-1.amazonaws.com',
             'X-Forwarded-For': '37.24.113.159, 54.240.145.73',
             'X-Forwarded-Port': '443',
             'X-Forwarded-Proto': 'https' },
          queryStringParameters: {test: '132'},
          pathParameters: {test: '456'},
          stageVariables: null, // TODO: Check how passed and test
          requestContext:
           { stage: 'dev',
             requestId: 'cc00f484-9c75-11e6-8236-19d9426b7ebb',
             identity:
              { sourceIp: '37.24.113.159' },
             resourcePath: '/health',
             httpMethod: 'GET',
             apiId: 'thal9f3ckh' },
          body: '{\n\t"foo": "BAR",\n\t"bar": 123\n}'
        },
        context: {}
      }
    }
  }

  arnie([
    ({request}) => {
      // TODO: Add tests for all other api methods!
      t.equal(request.method, 'GET', 'should parse the method')
      t.equal(request.path, '/health', 'should parse the path')
      t.deepEqual(request.query, {test: '132'}, 'should parse the query parameters')
      t.deepEqual(request.params, {test: '456'}, 'should parse the path parameters')
      t.equal(request.get('x-forwarded-port'), '443', 'should get a header field')
      t.assert(request.accepts('json'), 'should allow to check accepted type')
      t.equal(request.type, 'application/json', 'should expose the content the type')
      t.assert(request.is('json'), 'should allow to check the content type')
      t.deepEqual(request.body, {foo: 'BAR', bar: 123}, 'should parse a json body')
      t.equal(request.rawBody, '{\n\t"foo": "BAR",\n\t"bar": 123\n}', 'should provide raw body')
    }
  ], payload)
  .catch(console.error)
})
