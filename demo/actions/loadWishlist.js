export default async function loadWishlist (ctx, { id }) {
  try {
    return {
      wishlist: await fakeRequest(id)
    }
  } catch (error) {
    return { error }
  }
}

function fakeRequest (id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id) {
        reject({
          status: 404,
          message: 'Resource not found'
        })
      }
      resolve({ id })
    }, 200)
  })
}
