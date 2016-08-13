import method from '../../addons/method'
import cors from '../../addons/cors'
import loadWishlist from '../actions/loadWishlist'
import createWishlistPreview from '../actions/createWishlistPreview'
import show from '../../addons/show'
import fail from '../../addons/fail'

export default [
  cors('get, post, options'),
  method({
    get: [
      loadWishlist, {
        wishlist: [
          createWishlistPreview,
          show('params.wishlistPreview')
        ],
        error: [
          fail('params.error')
        ]
      }
    ],
    post: [
      show('params.wishlist')
    ]
  })
]
