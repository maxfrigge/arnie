const Tag = require('./tag')

class StringTag extends Tag {
  constructor (strings, values) {
    super('string', strings, values)
  }
  getValue (context) {
    if (!context) {
      throw new Error('You can not grab a value from a Tag without context')
    }

    return this.getPath(context)
  }
  setValue (context, value) {
    throw new Error(`You can not set a value on a ${this.type} Tag`)
  }
}

module.exports = (strings, ...values) => {
  return new StringTag(strings, values)
}
