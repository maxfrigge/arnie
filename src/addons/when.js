// TODO: Add support for when('params.wishlist', false, [])

import {PATH_WITHOUT_VALUE} from '../core/symbols'
import get from 'get-value'

export default (propertyPath, resultPaths) => {
  const resultIsTask = Array.isArray(resultPaths)
  function test (ctx) {
    const propertyValue = getPropertyValue(propertyPath, ctx)
    if (!resultIsTask) {
      return createValuePaths(propertyValue, resultPaths)
    } else {
      return createTruthyPath(propertyValue)
    }
  }

  test.displayName = `when(${propertyPath})`

  if (resultIsTask) {
    resultPaths = {
      truthy: resultPaths
    }
  }

  return [
    test,
    resultPaths
  ]
}

function getPropertyValue (propertyPath, ctx) {
  if (typeof propertyPath === 'function') {
    return propertyPath(ctx)
  }

  return get(ctx, propertyPath)
}

function createValuePaths (propertyValue, resultPaths) {
  if (typeof propertyValue === 'object') {
    return propertyValue
  }

  const pathExists = (path) => resultPaths.hasOwnProperty(path)
  if (propertyValue === undefined || !pathExists(propertyValue)) {
    return {
      otherwise: PATH_WITHOUT_VALUE
    }
  }

  return {
    [propertyValue]: PATH_WITHOUT_VALUE
  }
}

function createTruthyPath (propertyValue) {
  if (propertyValue) {
    return {
      truthy: PATH_WITHOUT_VALUE
    }
  }
}
