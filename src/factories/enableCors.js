export default function (methods, origin = '*') {
  return function enableCors (ctx) {
    ctx.set('Access-Control-Allow-Methods', methods)
    ctx.set('Access-Control-Allow-Origin', ctx.get('origin') || origin)
  }
}
