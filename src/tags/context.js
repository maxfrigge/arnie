const get = require('get-value')
const set = require('set-value')

class ContextTag {
  constructor (tag = 'context', options = {}, strings, values) {
    options.hasValue = options.hasValue === undefined ? true : options.hasValue

    this.type = tag
    this.options = options
    this.strings = strings
    this.values = values
  }
  /*
    Gets the path of the tag, where nested tags are evaluated
  */
  getPath (context) {
    if (!context) {
      throw new Error('You can not grab the path from a Tag without context')
    }

    return this.populatePath(context)
  }
  /*
    Uses the path of the tag to get value in related context
  */
  getValue (context) {
    if (!context) {
      throw new Error('You can not grab a value from a Tag without context')
    }

    if (this.options.hasValue) {
      if (this.type !== 'context' && !context[this.type]) {
        throw new Error('You can not grab a value from a Tag without its provider')
      }

      const path = this.getPath(context)
      const source = this.type === 'context' ? context : context[this.type]
      return get(source, path)
    } else {
      return this.getPath(context)
    }
  }
  /*
    Uses the path of the tag to set value in related context
  */
  setValue (context, value) {
    if (!this.options.hasValue) {
      throw new Error(`You can not set a value on a ${this.type} Tag`)
    }
    if (!context) {
      throw new Error('You can not set a value through a Tag without context')
    }
    if (this.type !== 'context' && !context[this.type]) {
      throw new Error('You can not set a value through a Tag without its provider')
    }
    const path = this.getPath(context)
    const target = this.type === 'context' ? context : context[this.type]
    return set(target, path, value)
  }
  /*
    Populates nested tags in the tags path
  */
  populatePath (context) {
    return this.strings.reduce((currentPath, string, idx) => {
      const valueTemplate = this.values[idx]

      if (valueTemplate instanceof ContextTag) {
        return currentPath + string + valueTemplate.getValue(context)
      }

      return currentPath + string + (valueTemplate || '')
    }, '')
  }
  /*
    Produces a string representation of the tag
  */
  toString () {
    return this.type + '`' + this.pathToString() + '`'
  }
  /*
    Produces a string representation of the path
  */
  pathToString () {
    return this.strings.reduce((currentPath, string, idx) => {
      const valueTemplate = this.values[idx]

      if (valueTemplate instanceof ContextTag) {
        return currentPath + string + '${' + valueTemplate.toString() + '}'
      }

      return currentPath + string + (valueTemplate || '')
    }, '')
  }
}

module.exports = ContextTag
