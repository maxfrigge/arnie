export default function (...args) {
  return function fail (ctx) {
    ctx.throw(401, 'access_denied', { user: {fooBar: 'TEST'} })
  }
}
