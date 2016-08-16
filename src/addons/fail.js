export default function (...args) {
  return function fail (ctx) {
    ctx.throw(...args)
  }
}
