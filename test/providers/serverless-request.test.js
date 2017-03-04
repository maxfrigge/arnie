const t = require('tap')
const A = require('../../src')
const ServerlessRequest = require('../../src/providers/serverless-request')
const arnie = A({
  providers: [ServerlessRequest()]
})

t.test('Provider: ServerlessRequest', (t) => {
  t.plan(10)

  const payload = {
    serverless: {
      aws: {
        event: { resource: '/webhook',
          path: '/webhook',
          httpMethod: 'POST',
          headers: {
            'Accept-Encoding': 'deflate, gzip',
            'Content-Type': 'application/json',
            'X-Forwarded-Port': '443',
            'Host': 'thal9f3ckh.execute-api.eu-central-1.amazonaws.com',
            'Via': '1.1 8008015354a3ca72f56c382a1d1cfe9f.cloudfront.net (CloudFront)'
          },
          queryStringParameters: {test: '132'},
          pathParameters: {test: '456'},
          stageVariables: null, // TODO: Check how passed and test
          requestContext: {
            accountId: '756919022514',
            resourceId: 't086e5',
            stage: 'dev',
            requestId: 'e948cc68-a126-11e6-a651-c3f10ad62c96',
            identity: {},
            resourcePath: '/webhook',
            httpMethod: 'POST',
            apiId: 'thal9f3ckh'
          },
          body: '{"foo": "BAR", "bar": 123}' },
        context: {}
      }
    }
  }

  arnie([
    ({request}) => {
      // TODO: Add tests for all other api methods!
      t.equal(request.method, 'POST', 'should parse the method')
      t.equal(request.path, '/webhook', 'should parse the path')
      t.deepEqual(request.query, {test: '132'}, 'should parse the query parameters')
      t.deepEqual(request.params, {test: '456'}, 'should parse the path parameters')
      t.equal(request.get('x-forwarded-port'), '443', 'should get a header field')
      t.assert(request.accepts('json'), 'should allow to check accepted type')
      t.equal(request.type, 'application/json', 'should expose the content the type')
      t.assert(request.is('json'), 'should allow to check the content type')
      t.deepEqual(request.body, {foo: 'BAR', bar: 123}, 'should parse a json body')
      t.equal(request.rawBody, '{"foo": "BAR", "bar": 123}', 'should provide raw body')
    }
  ], payload)
  .catch(console.error)
})
