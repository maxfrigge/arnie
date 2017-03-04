const Tag = require('./tag')

class RequestTag extends Tag {
  constructor (strings, values) {
    super('request', strings, values)
  }
}

module.exports = (strings, ...values) => {
  return new RequestTag(strings, values)
}
