const Tag = require('./tag')

class PropsTag extends Tag {
  constructor (strings, values) {
    super('props', strings, values)
  }
}

module.exports = (strings, ...values) => {
  return new PropsTag(strings, values)
}
