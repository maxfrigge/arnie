import Koa from 'koa'
import arnie from '../lib/koa-arnie'
import wishlist from './routes/wishlist'

const app = new Koa()
app.use(arnie.action('/wishlist/:id?', wishlist))

arnie.addTask('wishlist', [
  route('/wishlist', [
    cors('get, post, options'),
    acceptsOrFail('json', Boom.wrongMethod),
    accepts({
      json: [],
      html: []
    }),
    loadShopFromHeader,
    method({
      get: listWishlists,
      post: createWishlist
    }),
    status(200),
    header('Cache-Control', 'no-cache'),
    header({
      'Cache-Control': 'no-cache'
    }),
    cache('no-cache'), // don't use if it's just the header
    etag(),
    redirect('/logout'),
    status(200),
    show({
      wishlist: 'input.wishlist',
      user: 'input.user',
      shop: 'input.shop'
    }),
    fail(Boom.notFound, 'Wishlist not found.', 'params.error'),
    fail(Boom.notFound, 'Wishlist not found.', ({params}) => params.error)
  ])
])

arnie.addTask('wishlist', [
  whenRoute('/wishlist', [
    setCors('get, post, options'),
    acceptsOrFail('json', Boom.wrongMethod),
    loadShopFromHeader,
    whenMethod({
      get: listWishlists,
      post: createWishlist
    }),
    setCache('no-cache'), // don't use if it's just the header
    setHeader('Cache-Control', 'no-cache'),
    setEtag(),
    redirect('/logout'),
    setStatus(200),
    setHeader({
      'Cache-Control': 'no-cache'
    }),
    show('params.wishlist'),
    fail(Boom.notFound, 'Wishlist not found.', 'params.error'),
    fail(Boom.notFound, 'Wishlist not found.', ({params}) => params.error)
  ])
])

route({
  '/wishlist': [
    method({
      get: list_all_wishlists_task,
      post: createWishlistTask,
      delete: deleteAllWishlistsTask
    })
  ],
  '/wishlist/:id': [
    method({
      get: [],
      post: [],
      delete: []
    })
  ]
})

arnie.addTask('wishlist', [
  matchRoute('/wishlist', [
    cors('get, post, options'),
    accepts('json'),
    loadShopFromHeader,
    method({
      get: listWishlists,
      post: createWishlist
    }),
    status(200),
    header('Cache-Control', 'no-cache'),
    header({
      'Cache-Control': 'no-cache'
    }),
    cache('no-cache'), // don't use if it's just the header
    etag(),
    redirect('/logout'),
    status(200),
    show('params.wishlist'),
    fail(Boom.notFound, 'Wishlist not found.', 'params.error'),
    fail(Boom.notFound, 'Wishlist not found.', ({params}) => params.error)
  ])
])

// TODO: Test how next works
// TODO: Allow adding regular koa middleware requires signature (ctx, next, params)
// TODO: use ctx.params instead input.. pass params as third arg

// arnie.addRoute('/wishlist', []) => arnie.addTask('/wishlist', [path('/wishlist', [])])

const task = task(
  run(loadWishlist),
  when({
    wishlist: run([]),
    error: run([])
  })
)

const task = [
  loadWishlist, {
    wishlist: [],
    error: []
  }
]

when({
  wishlist: [],
  error: []
})

when('params.wishlist', [])
when('params.wishlist', false, [])

arnie.addTasks({
  wishlist: []
})

// arnie.addTask()
// arnie.addTasks()
// arnie.getTasks()
// arnie.runTask()
// arnie.runAllTasks()
arnie.doIt({
  task1,
  task2
})

const app = Koa()

const arnie = Arnie({
  route: {
    prefix: '/v1'
  }
})
// Config get's passed as ctx.arnie.config and is free to use by actions
// Could also make it singleton/static so that factories can use config too??
const routeWishlist = [
  route('/wishlist/:wishlistId?', [
    cors('get, post, delete, options'),
    loadShopFromHeader,
    restEndoint({
      create: createWishlist,
      show: showWishlist,
      update: updateWishlist,
      delete: deleteWishlist
    })
  ])
]

const routeWishlistItem = [
  route('/wishlist/:wishlistId/item/:itemId?', [ // Find better way with flat hierachy
    cors('get, post, delete, options'),
    loadShopFromHeader,
    restEndoint({
      create: createWishlistItem,
      show: showWishlistItem,
      update: updateWishlistItem,
      delete: deleteWishlistItem
    })
  ])
]

app.use(
  arnie.doIt({
    routeWishlist,
    routeWishlistItem
  })
)

let port = process.env.PORT || 8080
app.listen(port)

console.log(`Server running on port ${port}`)

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
