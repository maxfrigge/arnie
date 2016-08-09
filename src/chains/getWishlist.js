import createWishlistPreview from '../actions/createWishlistPreview'
import loadWishlist from '../actions/loadWishlist'
import returnError from '../actions/returnError'
import returnData from '../factories/returnData'

export default [
  loadWishlist, {
    wishlist: [
      createWishlistPreview,
      returnData({
        wishlistPreview: 'wishlistPreview'
      })
    ],
    error: [
      returnError
    ]
  }
]
