import when from './when'

export default (paths) => {
  return when((ctx) => ctx.request.method.toLowerCase(), paths)
}
