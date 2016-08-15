import get from 'get-value'

export default function (definition) {
  return function show (ctx) {
    if (typeof definition === 'string') {
      bodyFromPath(ctx, definition)
    } else {
      bodyFromObject(ctx, definition)
    }
  }
}

function bodyFromPath (ctx, path) {
  ctx.body = get(ctx, path)
}

function bodyFromObject (ctx, structure) {
  if (typeof ctx.body !== 'object') {
    ctx.body = {}
  }

  for (const prop in structure) {
    ctx.body[prop] = get(ctx, structure[prop])
  }
}
