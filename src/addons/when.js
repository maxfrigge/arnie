import {PATH_WITHOUT_VALUE} from '../core/symbols'
import get from 'get-value'

export default (propertyPath, resultPaths) => {
  function test (ctx, next) {
    const propertyValue = get(ctx, propertyPath)
    const pathExists = (path) => resultPaths.hasOwnProperty(path)
    if (propertyValue === undefined || !pathExists(propertyValue)) {
      return {
        otherwise: PATH_WITHOUT_VALUE
      }
    }

    return {
      [propertyValue]: PATH_WITHOUT_VALUE
    }
  }

  test.displayName = `when(${propertyPath})`

  return [
    test,
    resultPaths
  ]
}
