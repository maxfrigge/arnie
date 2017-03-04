const t = require('tap')
const input = require('../../src/tags/input')

t.test('Tag: input', (t) => {
  const context = {
    input: {
      foo: 'bar',
      map: {
        foo: 'bar'
      },
      keyInMap: 'foo'
    }
  }

  const tag = input`foo`
  t.equals(tag.toString(), 'input`foo`')
  t.equals(tag.getValue(context), 'bar')
  tag.setValue(context, 'new value')
  t.equals(tag.getValue(context), 'new value')

  const nestedTag = input`map.${input`keyInMap`}`
  t.equals(nestedTag.toString(), 'input`map.${input`keyInMap`}`')
  t.equals(nestedTag.getValue(context), 'bar')

  t.end()
})
