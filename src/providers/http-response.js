const contentDisposition = require('content-disposition')
const getType = require('mime-types').contentType
const isJSON = require('koa-is-json')
const escape = require('escape-html')
const typeis = require('type-is').is
const statuses = require('statuses')
const assert = require('assert')
const extname = require('path').extname
const vary = require('vary')

module.exports = (options) => {
  return (context, functionDetails, payload) => {
    context.response = HttpResponse(payload)
    return context
  }
}

function HttpResponse (payload) {
  if (!payload.response) {
    payload.response = {
      statusCode: 404,
      headers: {}
    }
  }
  const response = {
    get header () {
      return response.headers
    },
    get headers () {
      return payload.response.headers || {}
    },
    get status () {
      return payload.response.statusCode
    },
    set status (code) {
      assert(typeof code === 'number', 'status code must be a number')
      assert(statuses[code], `invalid status code: ${code}`)
      payload.response._explicitStatus = true
      payload.response.statusCode = code
      payload.response.statusMessage = statuses[code]
      if (response.body && statuses.empty[code]) response.body = null
    },
    get message () {
      return payload.response.statusMessage || statuses[response.status]
    },
    set message (msg) {
      payload.response.statusMessage = msg
    },
    get body () {
      return payload.response.body
    },
    set body (val) {
      payload.response.body = val

      if (val === null) {
        if (!statuses.empty[response.status]) {
          response.status = 204
        }
        response.remove('content-type')
        response.remove('content-length')
        response.remove('transfer-encoding')
        return
      }

      if (!payload.response._explicitStatus) {
        response.status = 200
      }

      const setType = !response.header['content-type']

      // string
      if (typeof val === 'string') {
        if (setType) {
          response.type = /^\s*</.test(val) ? 'html' : 'text'
        }
        response.length = Buffer.byteLength(val)
        return
      }

      // buffer
      if (Buffer.isBuffer(val)) {
        if (setType) {
          response.type = 'bin'
        }
        response.length = val.length
        return
      }

      // stream (NOT SUPPORTED)
      // if (typeof val.pipe === 'function') {
      //   onFinish(this.res, destroy.bind(null, val))
      //   ensureErrorHandler(val, err => this.ctx.onerror(err))
      //
      //   // overwriting
      //   if (null != original && original != val) this.remove('Content-Length');
      //
      //   if (setType) this.type = 'bin';
      //   return;
      // }

      // json
      response.remove('content-length')
      response.type = 'json'
    },
    set length (n) {
      response.set('content-length', n)
    },
    get length () {
      const len = response.header['content-length']
      const body = response.body

      if (len === null) {
        if (!body) {
          return
        }
        if (typeof body === 'string') {
          return Buffer.byteLength(body)
        }
        if (Buffer.isBuffer(body)) {
          return body.length
        }
        if (isJSON(body)) {
          return Buffer.byteLength(JSON.stringify(body))
        }
        return
      }

      return ~~len
    },
    vary (field) {
      vary(payload.response, field)
    },
    redirect (url, alt) {
      // location
      if (url === 'back') {
        url = response.get('Referrer') || alt || '/'
      }
      response.set('Location', url)

      // status
      if (!statuses.redirect[response.status]) {
        response.status = 302
      }

      // html
      if (response.accepts('html')) {
        url = escape(url)
        response.type = 'text/html; charset=utf-8'
        response.body = `Redirecting to <a href="${url}">${url}</a>.`
        return
      }

      // text
      response.type = 'text/plain; charset=utf-8'
      response.body = `Redirecting to ${url}.`
    },
    attachment (filename) {
      if (filename) {
        response.type = extname(filename)
      }
      response.set('content-disposition', contentDisposition(filename))
    },
    set type (type) {
      type = getType(type) || false
      if (type) {
        response.set('content-type', type)
      } else {
        response.remove('content-type')
      }
    },
    set lastModified (val) {
      if (typeof val === 'string') {
        val = new Date(val)
      }
      response.set('last-modified', val.toUTCString())
    },
    get lastModified () {
      const date = response.get('last-modified')
      if (date) {
        return new Date(date)
      }
    },
    set etag (val) {
      if (!/^(W\/)?"/.test(val)) {
        val = `"${val}"`
      }
      response.set('etag', val)
    },
    get etag () {
      return response.get('etag')
    },
    get type () {
      const type = response.get('content-type')
      if (!type) {
        return ''
      }
      return type.split(';')[0]
    },
    is (types) {
      const type = response.type
      if (!types) {
        return type || false
      }
      if (!Array.isArray(types)) {
        types = [].slice.call(arguments)
      }
      return typeis(type, types)
    },
    get (field) {
      return response.header[field.toLowerCase()] || ''
    },
    set (field, val) {
      if (arguments.length === 2) {
        if (Array.isArray(val)) {
          val = val.map(String)
        } else {
          val = String(val)
        }
        payload.response.header[field.toLowerCase()] = val
      } else {
        for (const key in field) {
          response.set(key, field[key])
        }
      }
    },
    remove (field) {
      delete payload.response.header[field.toLowerCase()]
    }
  }

  return response
}
