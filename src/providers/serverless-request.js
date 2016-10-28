const net = require('net')
const contentType = require('content-type')
const typeis = require('type-is')
const fresh = require('fresh')

module.exports = (options) => {
  return (context, functionDetails, payload) => {
    if (payload.serverless) {
      context.request = ServerlessRequest(payload, context.response)
    } else {
      console.warn('The ServerlessRequestProvider can only be used with the serverless adapter.')
    }
    return context
  }
}

function ServerlessRequest (payload, response) {
  const request = {
    get header () {
      return payload.serverless.aws.event.headers
    },
    get headers () {
      return payload.serverless.aws.event.headers
    },
    get url () {
      return `${request.origin}${request.path}`
    },
    get origin () {
      return `${request.protocol}://${request.host}`
    },
    get method () {
      return payload.serverless.aws.event.httpMethod
    },
    get path () {
      return payload.serverless.aws.event.path
    },
    get query () {
      return payload.serverless.aws.queryStringParameters
    },
    get host () {
      let host = request.get('x-forwarded-host') || request.get('host')
      if (!host) {
        return ''
      }
      return host.split(/\s*,\s*/)[0]
    },
    get hostname () {
      const host = request.host
      if (!host) return ''
      return host.split(':')[0]
    },
    get fresh () {
      const method = request.method
      const s = response.status

      // GET or HEAD for weak freshness validation only
      if (method !== 'GET' && method !== 'HEAD') return false

      // 2xx or 304 as per rfc2616 14.26
      if ((s >= 200 && s < 300) || s === 304) {
        return fresh(request.header, response.header)
      }

      return false
    },
    get stale () {
      return !request.fresh
    },
    get idempotent () {
      const methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE']
      return !!~methods.indexOf(request.method)
    },
    get charset () {
      const type = request.get('content-type')
      if (!type) return ''

      return contentType.parse(type).parameters.charset || ''
    },
    get length () {
      const len = request.get('content-length')
      if (len === '') return
      return ~~len
    },
    get protocol () {
      const proto = request.get('x-forwarded-proto') || 'http'
      return proto.split(/\s*,\s*/)[0]
    },
    get secure () {
      return request.protocol === 'https'
    },
    get ips () {
      const val = request.get('x-forwarded-for')
      return val ? val.split(/\s*,\s*/) : []
    },
    get subdomains () {
      const hostname = request.hostname
      if (net.isIP(hostname)) {
        return []
      }
      return hostname
        .split('.')
        .reverse()
    },
    accepts () {
      return request.accept.types.apply(request.accept, arguments)
    },
    acceptsEncodings () {
      return request.accept.encodings.apply(request.accept, arguments)
    },
    acceptsCharsets () {
      return request.accept.charsets.apply(request.accept, arguments)
    },
    acceptsLanguages () {
      return request.accept.languages.apply(request.accept, arguments)
    },
    is (types) {
      if (!types) {
        return typeis(request)
      }
      if (!Array.isArray(types)) {
        types = [].slice.call(arguments)
      }
      return typeis(request, types)
    },
    get type () {
      const type = request.get('content-type')
      if (!type) return ''
      return type.split('')[0]
    },
    get (field) {
      const header = request.header
      switch (field = field.toLowerCase()) {
        case 'referer':
        case 'referrer':
          return header.referrer || header.referer || ''
        default:
          return header[field] || ''
      }
    }
  }

  return request
}
