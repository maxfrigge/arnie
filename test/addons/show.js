import test from 'tape'
import {setupKoa, teardownKoa} from '../utils/koa'
import middleware from '../../src/core/middleware'
import route from '../../src/addons/route'
import show from '../../src/addons/show'

test('Addon: show()', (t) => {
  t.plan(6)

  const koa = setupKoa()
  const jsonTask = [
    () => {
      return {valueA: 'foo', valueB: 'bar', html: '<p>some markup</p>'}
    },
    route('/json-from-object', [
      show({
        propNameA: 'input.valueA',
        propNameB: 'input.valueB'
      })
    ]),
    route('/json-from-path', [
      show('input')
    ]),
    route('/html', [
      show('input.html')
    ])
  ]
  koa.app.use(
    middleware({
      jsonTask
    })
  )

  koa.request.get('/json-from-object').end((err, res) => {
    if (!err) {
      t.equal(
        res.type,
        'application/json'
      )
      t.deepEqual(
        res.body,
        {propNameA: 'foo', propNameB: 'bar'},
        'should return json encoded body from object'
      )
    }
    teardownKoa(koa)
  })
  koa.request.get('/json-from-path').end((err, res) => {
    if (!err) {
      t.equal(
        res.type,
        'application/json'
      )
      t.deepEqual(
        res.body,
        {valueA: 'foo', valueB: 'bar', html: '<p>some markup</p>'},
        'should return json encoded body from path string'
      )
    }
    teardownKoa(koa)
  })
  koa.request.get('/html').end((err, res) => {
    if (!err) {
      t.equal(
        res.type,
        'text/html'
      )
      t.deepEqual(
        res.text,
        '<p>some markup</p>',
        'should return html body from path string'
      )
    }
    teardownKoa(koa)
  })
})
