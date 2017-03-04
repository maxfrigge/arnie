const ContextTag = require('./context')

class InputTag extends ContextTag {
  constructor (strings, values) {
    super('input', {}, strings, values)
  }
}

module.exports = (strings, ...values) => {
  return new InputTag(strings, values)
}
