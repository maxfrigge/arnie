const test = require('tape')
const A = require('../../src')
const ServerlessRequest = require('../../src/providers/serverless-request')
const arnie = A({
  providers: [ServerlessRequest()]
})

test('Arnie (serverless-request)', (t) => {
  t.plan(4)

  const payload = {
    serverless: {
      aws: {
        event: {
          path: '/health',
          httpMethod: 'GET',
          headers:
           { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
             'Accept-Encoding': 'gzip, deflate, sdch, br',
             'Host': 'thal9f3ckh.execute-api.eu-central-1.amazonaws.com',
             'X-Forwarded-For': '37.24.113.159, 54.240.145.73',
             'X-Forwarded-Port': '443',
             'X-Forwarded-Proto': 'https' },
          queryStringParameters: null, // TODO: Check how passed and test
          pathParameters: null, // TODO: Check how passed and test
          stageVariables: null, // TODO: Check how passed and test
          requestContext:
           { stage: 'dev',
             requestId: 'cc00f484-9c75-11e6-8236-19d9426b7ebb',
             identity:
              { sourceIp: '37.24.113.159' },
             resourcePath: '/health',
             httpMethod: 'GET',
             apiId: 'thal9f3ckh' },
          body: null // TODO: Check how passed and test t.equal(request.type, 'json', 'should parse the type') t.assert(request.is('json'), 'should allow to check content type')
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
      t.equal(request.get('x-forwarded-port'), '443', 'should get a header field')
      t.assert(request.accepts('text'), 'should allow to check accepted type')
    }
  ], payload)
  .catch(console.error)
})
