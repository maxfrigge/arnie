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
  if (typeof resolver === 'object') {
    return resolver.getValue(ctx)
  }

  return resolver
}

function setValue (ctx, resolver, value) {
  if (typeof resolver === 'function') {
    resolver(ctx, value)
  }
  if (typeof resolver === 'object') {
    resolver.setValue(ctx, value)
  }
}
