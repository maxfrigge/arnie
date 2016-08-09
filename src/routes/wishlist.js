import whenMethod from '../operators/whenMethod'
import enableCors from '../factories/enableCors'
import getWishlist from '../chains/getWishlist'
import postWishlist from '../chains/postWishlist'

export default [
  enableCors('get, post, options'),
  ...whenMethod({
    get: getWishlist,
    post: postWishlist
  })
]
