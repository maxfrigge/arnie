import Koa from 'koa'
import Arnie from '../lib/arnie'
import cors from '../lib/addons/cors'
import route from '../lib/addons/route'
import restEndoint from '../lib/addons/restEndoint'

// arnie.addTask('wishlist', [
//   route('/wishlist', [
//     acceptsOrFail('json', Boom.wrongMethod),
//     accepts({
//       json: [],
//       html: []
//     }),
//     fail(Boom.notFound, 'Wishlist not found.', 'params.error'),
//     fail(Boom.notFound, 'Wishlist not found.', ({params}) => params.error)
//   ])
// ])

// TODO: Add support for when('params.wishlist', false, [])
// TODO: Test how next works
// TODO: Allow adding regular koa middleware requires signature (ctx, next, params)

const app = new Koa()
const arnie = Arnie({
  route: {
    prefix: '/v1'
  }
})
// TODO: Add support for config params
// Config get's passed as ctx.arnie.config and is free to use by actions
// Could also make it singleton/static so that factories can use config too??

// @TODO: Implement sample action
const loadShopFromHeader = () => false

const routeWishlist = [
  route('/wishlist/:wishlistId?', [
    cors('get, post, delete, options'),
    loadShopFromHeader,
    restEndoint({
      list: () => console.log('list wishlists'),
      show: () => console.log('show wishlist'),
      create: () => console.log('create wishlist'),
      update: () => console.log('update wishlist'),
      clear: () => console.log('clear wishlists'),
      remove: () => console.log('remove wishlist')
    })
  ])
]

const routeWishlistItem = [
  route('/wishlist/:wishlistId/item/:itemId?', [ // Find better way with flat hierachy
    cors('get, post, delete, options'),
    acceptsOrFail('json', Boom.notAcceptable),
    loadShopFromHeader,
    restEndoint({
      list: () => console.log('list wishlist-items'),
      show: () => console.log('show wishlist-item'),
      create: () => console.log('create wishlist-item'),
      update: () => console.log('update wishlist-item'),
      clear: () => console.log('clear wishlist-items'),
      remove: () => console.log('remove wishlist-item')
    }),
    cache() // TODO: find decent default cache strategy e.g. etag
  ])
]

app.use(
  arnie.doIt({
    routeWishlist,
    routeWishlistItem
  })
)

const server = app.listen(process.env.PORT || 8080)

console.log(`Server running on port ${server.port}`)

process.on('SIGINT', exit)
process.on('SIGTERM', exit)

function exit () {
  server.close()
  process.exit()
}
