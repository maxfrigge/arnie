const Tag = require('./tag')

class InputTag extends Tag {
  constructor (strings, values) {
    super('input', strings, values)
  }
}

module.exports = (strings, ...values) => {
  return new InputTag(strings, values)
}
