const t = require('tap')
const string = require('./string')
const props = require('./props')

t.test('Tag: string', (t) => {
  const context = {
    props: {
      foo: 'bar'
    }
  }

  const tag = string`foo.${props`foo`}`
  t.equals(tag.getValue(context), 'foo.bar', 'should create a string with nested tags')

  // TODO: should throw!
  t.throws(() => {
    tag.setValue(context, 'new value')
  }, 'should be read only')

  t.end()
})
