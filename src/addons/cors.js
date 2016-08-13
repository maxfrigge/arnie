export default function (methods, origin = '*') {
  return function cors (ctx) {
    let allowedOrigin = origin
    if (allowedOrigin === '*') {
      allowedOrigin = ctx.get('origin') || '*'
    }
    ctx.set('Access-Control-Allow-Methods', methods)
    ctx.set('Access-Control-Allow-Origin', allowedOrigin)
  }
}
