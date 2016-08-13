export default function (target) {
  return function redirect (ctx) {
    let url = typeof target === 'function' ? target(ctx) : target
    ctx.redirect(url)
  }
}
