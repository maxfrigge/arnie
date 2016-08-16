import when from './when'

export default (routes) => {
  const actions = Object
  .keys(routes)
  .map((name) => createRoute(routes, name))

  // @TODO: Test for allowed methods and implement otherwise route?
  return actions
}

function createRoute (routes, name) {
  switch (name) {
    case 'list':
      return when((ctx) => isMethod(ctx, 'GET') && !hasId(ctx), routes[name])
    case 'show':
      return when((ctx) => isMethod(ctx, 'GET') && hasId(ctx), routes[name])
    case 'create':
      return when((ctx) => isMethod(ctx, 'POST') && !hasId(ctx), routes[name])
    case 'update':
      return when((ctx) => isMethod(ctx, 'POST') && hasId(ctx), routes[name])
    case 'clear':
      return when((ctx) => isMethod(ctx, 'DELETE') && !hasId(ctx), routes[name])
    case 'remove':
      return when((ctx) => isMethod(ctx, 'DELETE') && hasId(ctx), routes[name])
    default:
      throw new Error(`Unknown route for rest endpoint ${name}`)
  }
}

function isMethod (ctx, method) {
  return ctx.request.method === method
}

function hasId (ctx) {
  const idParam = ctx.input.routeKeys[ctx.input.routeKeys.length - 1]
  return ctx.input[idParam.name] !== undefined
}
