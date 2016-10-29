const get = require('get-value')
const set = require('set-value')

module.exports = (targetTemplate, valueTemplate) => {
  return function set (ctx) {
    const value = getValue(ctx, valueTemplate)
    setValue(ctx, targetTemplate, value)
  }
}

function isContextPath (value) {
  const regexp = /^[a-z]+:/gi
  return regexp.test(value)
}

function getValue (ctx, path) {
  if (typeof path === 'function') {
    path = path(ctx)
  }
  if (isContextPath(path)) {
    return get(ctx, path.replace(':', '.'))
  }
  if (typeof path === 'string') {
    return path.replace(/\\:/g, ':')
  }
  return path
}

function setValue (ctx, path, value) {
  if (typeof path === 'function') {
    path = path(ctx)
  }
  return set(ctx, path.replace(':', '.'), value)
}
