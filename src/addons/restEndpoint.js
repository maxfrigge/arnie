import when from './when'
import fail from './fail'

const pathTests = {
  list: (ctx) => isMethod(ctx, 'GET') && !hasId(ctx),
  show: (ctx) => isMethod(ctx, 'GET') && hasId(ctx),
  create: (ctx) => isMethod(ctx, 'POST') && !hasId(ctx),
  update: (ctx) => isMethod(ctx, 'POST') && hasId(ctx),
  clear: (ctx) => isMethod(ctx, 'DELETE') && !hasId(ctx),
  remove: (ctx) => isMethod(ctx, 'DELETE') && hasId(ctx)
}

export default (routes) => {
  if (!routes.hasOwnProperty('otherwise')) {
    routes.otherwise = [fail(405)]
  }
  return when(getRoute, routes)
}

function getRoute (ctx) {
  for (const path in pathTests) {
    const match = pathTests[path](ctx)
    if (match) {
      return path
    }
  }

  return 'otherwise'
}

function isMethod (ctx, method) {
  return ctx.request.method === method
}

function hasId (ctx) {
  const idParam = ctx.input.routeKeys[ctx.input.routeKeys.length - 1]
  return ctx.input[idParam.name] !== undefined
}
