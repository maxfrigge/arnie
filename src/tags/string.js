const ContextTag = require('./context')

class StringTag extends ContextTag {
  constructor (strings, values) {
    super('string', {hasValue: false}, strings, values)
  }
}

module.exports = (strings, ...values) => {
  return new StringTag(strings, values)
}
