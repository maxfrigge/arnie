const get = require('get-value')
const set = require('set-value')

class Tag {
  constructor (tag, strings, values) {
    this.type = tag
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

    if (!context[this.type]) {
      throw new Error('You can not grab a value from a Tag without its provider')
    }

    const source = context[this.type]
    const path = this.getPath(context)
    return get(source, path)
  }
  /*
    Uses the path of the tag to set value in related context
  */
  setValue (context, value) {
    if (!context) {
      throw new Error('You can not set a value through a Tag without context')
    }
    if (!context[this.type]) {
      throw new Error('You can not set a value through a Tag without its provider')
    }
    const target = context[this.type]
    const path = this.getPath(context)
    return set(target, path, value)
  }
  /*
    Populates nested tags in the tags path
  */
  populatePath (context) {
    return this.strings.reduce((currentPath, string, idx) => {
      const valueTemplate = this.values[idx]

      if (valueTemplate instanceof Tag) {
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

      if (valueTemplate instanceof Tag) {
        return currentPath + string + '${' + valueTemplate.toString() + '}'
      }

      return currentPath + string + (valueTemplate || '')
    }, '')
  }
}

module.exports = Tag
