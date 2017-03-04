const get = require('get-value')
const set = require('set-value')
const Tag = require('./tag')

class ContextTag extends Tag {
  constructor (strings, values) {
    super('context', strings, values)
  }
  getValue (context) {
    if (!context) {
      throw new Error('You can not grab a value from a Tag without context')
    }

    if (this.type !== 'context' && !context[this.type]) {
      throw new Error('You can not grab a value from a Tag without its provider')
    }

    const path = this.getPath(context)
    return get(context, path)
  }
  setValue (context, value) {
    if (!context) {
      throw new Error('You can not set a value through a Tag without context')
    }
    const path = this.getPath(context)
    return set(context, path, value)
  }
}

module.exports = ContextTag
