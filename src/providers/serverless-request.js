const net = require('net')
const contentType = require('content-type')
const typeis = require('type-is')
const fresh = require('fresh')
const accepts = require('accepts')

module.exports = (options = {}) => {
  return (context, functionDetails, payload) => {
    if (payload.serverless) {
      context.request = ServerlessRequest(payload, context.response)
    } else {
      console.warn('The ServerlessRequestProvider should be used with the serverless adapter.')
    }
    return context
  }
}

function ServerlessRequest (payload, response) {
  const headers = getHeaders(payload)
  const accept = accepts({headers})
  const request = {
    get header () {
      return headers
    },
    get headers () {
      return headers
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
    get body () {
      if (request.is('json')) {
        try {
          return JSON.parse(request.rawBody)
        } catch (error) {
          console.warn(`Unable to parse request body as json: ${error.message}`)
        }
      }
      return request.rawBody
    },
    get rawBody () {
      return payload.serverless.aws.event.body
    },
    get path () {
      return payload.serverless.aws.event.path
    },
    get query () {
      return payload.serverless.aws.event.queryStringParameters
    },
    get params () {
      return payload.serverless.aws.event.pathParameters
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
      return accept.types.apply(accept, arguments)
    },
    acceptsEncodings () {
      return accept.encodings.apply(accept, arguments)
    },
    acceptsCharsets () {
      return accept.charsets.apply(accept, arguments)
    },
    acceptsLanguages () {
      return accept.languages.apply(accept, arguments)
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
      if (!type) {
        return ''
      }
      return type.split(';')[0]
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

function getHeaders (payload) {
  const obj = payload.serverless.aws.event.headers
  const keys = Object.keys(obj)
  const header = {}
  let n = keys.length
  while (n--) {
    const key = keys[n]
    header[key.toLowerCase()] = obj[key]
  }
  return header
}
