const Tag = require('./tag')

class ResponseTag extends Tag {
  constructor (strings, values) {
    super('response', strings, values)
  }
}

module.exports = (strings, ...values) => {
  return new ResponseTag(strings, values)
}
