export default function (definition) {
  return function show (ctx, input) {
    if (typeof ctx.body !== 'object') {
      ctx.body = {}
    }

    for (const prop in definition) {
      ctx.body[prop] = input[definition[prop]]
    }
  }
}
