const t = require('tap')
const props = require('./props')

t.test('Tag: props', (t) => {
  const context = {
    props: {
      foo: 'bar',
      map: {
        foo: 'bar'
      },
      keyInMap: 'foo'
    }
  }

  const tag = props`foo`
  t.equals(tag.toString(), 'props`foo`')
  t.equals(tag.getValue(context), 'bar')
  tag.setValue(context, 'new value')
  t.equals(tag.getValue(context), 'new value')

  const nestedTag = props`map.${props`keyInMap`}`
  t.equals(nestedTag.toString(), 'props`map.${props`keyInMap`}`')
  t.equals(nestedTag.getValue(context), 'bar')

  t.end()
})
