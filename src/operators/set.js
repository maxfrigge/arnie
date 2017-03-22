module.exports = (target, value) => {
  return function set (ctx) {
    setValue(
      ctx,
      target,
      getValue(ctx, value)
    )
  }
}

function getValue (ctx, resolver) {
  if (typeof resolver === 'function') {
    return resolver(ctx)
  }
  if (typeof resolver === 'object' && resolver.getValue) {
    return resolver.getValue(ctx)
  }

  return resolver
}

function setValue (ctx, resolver, value) {
  if (typeof resolver === 'function') {
    resolver(ctx, value)
  }
  if (typeof resolver === 'object' && resolver.setValue) {
    resolver.setValue(ctx, value)
  }
}
