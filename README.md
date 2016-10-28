# ATTENTION PLEASE: I have just changed everything and refactored from the ground up (WIP) - DO NOT USE!

# KOA Arnie

**A real action hero for backends - heavily inspired by [CerebralJS](http://www.cerebraljs.com/)**

[![NPM version][npm-image]][npm-url]

Arnie wants action! Actions are structured in tasks and you compose them like legos to make things happen. Arnie is meant to be used with Koa2, but the core will work without it. The API is currently likely to change, so be adventures when using Arnie :)

Here is what a task looks like.

```javascript
export default [
  loadWishlist({shared: true}), {
    error: [
      fail(404, 'Wish list not found.')
    ]
  },
  createTempFolder('wishlist-'),
  copyPreviewTemplate(),
  loadProductImages({maxImages: 8}), {
    error: [
      fail(404, 'Product images not found.')
    ]
  },
  createPreviewMarkup(),
  renderPreviewMarkup(),
  send('input.previewImage'),
  removeTempFolder()
]
```

Guess you can somewhat grasp what this task does just from reading it and that's the whole point here. Arnie is not about writing magic code with super powers - he is all about expressing complex things with simple words - and this is totally stolen from [CerebralJS](http://www.cerebraljs.com/).

## Folder structure

This sample structure will be used throughout the docs and is a good way to start structuring your project.

```
src/
├── actions/
│   ├── loadWishlist.js
│   ├── createTempFolder.js
│   ├── copyPreviewTemplate.js
│   ├── ...
│   └── send.js
├── tasks/
│   └── showPreviewImage.js
└── app.js
```

## Building tasks

Tasks are defined in arrays an consist of three things

- **Actions** are defined in functions
- **Paths** are defined by objects
- **Tasks** are defined in arrays

Yes tasks can contain other tasks :)

Enough with the smart talk - let's get coding.

```javascript
// src/tasks/showPreviewImage.js
import {fail} from 'arnie/addons'

import copyPreviewTemplate from '../actions/copyPreviewTemplate'
import createTempFolder from '../actions/createTempFolder'
import createPreviewMarkup from '../actions/createPreviewMarkup'
import loadProductImages from '../actions/loadProductImages'
import loadWishlist from '../actions/loadWishlist'
import removeTempFolder from '../actions/createTempFolder'
import renderPreviewMarkup from '../actions/renderPreviewMarkup'
import send from '../actions/send'

export default [
  loadWishlist({shared: true}), {
    error: [
      fail(404, 'Wish list not found.')
    ]
  },
  createTempFolder('wishlist-'),
  copyPreviewTemplate(),
  loadProductImages({maxImages: 8}), {
    error: [
      fail(404, 'Product images not found.')
    ]
  },
  createPreviewMarkup(),
  renderPreviewMarkup(),
  send('input.previewImage', 31536000),
  removeTempFolder()
]
```
This is a sample tasks - it's an array at core and holds a mix of functions, objects and other arrays. Each of those functions calls are factories for actions, they create a preconfigured function that get will get called when the tasks is run. The objects define paths, which can be triggered at the end of an action. When a path gets triggered another tasks is run - those are the other arrays in the example above.

# Implementing actions

Actions are simple functions. They get one argument (it's called context) and they return an object (let's call it output). That's about it. When using tasks as Koa2 middle the conext object will be the [Koa conext](https://github.com/koajs/koa/blob/v2.x/docs/api/context.md).

```javascript
// src/actions/createTempFolder.js
import fs from 'mz/fs'
import shortid from 'shortid'

export default (prefix) => {
  return async function createTempFolder (ctx) {
    const tempFolder = `/tmp/${prefix}${shortid.generate()}`
    await fs.mkdir(tempFolder)

    return {
      tempFolder
    }
  }
}
```

This action factory creates the actual `createTempFolder()` action by returning it as a function. This function will be called within the task. It's handy to use a factory, because they allow you configure your actions when building tasks.

In this example the action is an async function, but this is entirely up to you. I personally tend to use them a lot on the server, thanks to Koa2. It's needless to say that you will have to transpile your code when using these kind of features.

The action's output will be an Object containing the folders path e.g. `{tempFolder: /tmp/wishlist-d4th1s}`.

## Using paths

You have already seen a path definition and trigger in the examples before - let's take a closer look.

```javascript
export default [
  loadWishlist({shared: true}), {
    wishlist: [
      send('input.wishlist')
    ],
    error: [
      fail(404, 'Wish list not found.')
    ]
  }
]
```

In the example the defined paths are `wishlist` and `error`. Each path defines a tasks that gets run when the path is triggered. A path gets triggered when an action returns an object with a key that matches a path.

```javascript
export default ({id = 'input.wishlistId', shared = false}) => {
  return async function loadWishlist (ctx) {
    const wishlistId = get(ctx, id)
    const wishlist = await db.collection('wishlists').findOne({
      permaId: ObjectId(wishlistId),
      shared
    })

    if (!wishlist) {
      return {
        error: true
      }
    }

    return {
      wishlist
    }
  }
}
```

This action could trigger two paths `wishlist` and `error`. There is one other scenario that could trigger a path - it's when an exceptions is thrown. An uncaught exception would also trigger the path `error`.

## Input & output

When an actions returns output, the output will be shallow merged into `context.input`. That allows actions to pass along data, which can then be used by other actions. The `context.input` object should only be read and never directly mutated.

## Koa2 middleware

Arnie can take tasks and run them as Koa2 middlware. All tasks will be executed on every request and pass the Koa conext to your actions.

```javascript
// src/app.js
import Koa from 'koa'

import Arnie from 'arnie'
import {route, restEndpoint, show, status} from 'arnie/addons'

import showPreviewImage from './tasks/showPreviewImage'

const app = new Koa()
const arnie = Arnie()

const tasks = {
  wishlistPreview: [
    route({
      '/wishlist-preview/health': [
        status(200),
        show('request.path')
      ],
      '/wishlist-preview/:wishlistId?': [
        restEndpoint({
          show: showPreviewImage
        })
      ]
    })
  ]
}

app.use(arnie.koa(tasks))

app.listen(80)
```

You can see that Arnie comes with addons that will help you with the most common use cases.

## Addons: batteries included

Arnie comes with a bunch off legos, which are supposed to assist you in building your next backend application. Each addon will be explained with a short task definition - look into the [tests](https://github.com/maxfrigge/arnie/tree/master/test/addons) to find out more.

### addon/accepts
```javascript
export default [
  accepts({
    json: [
      sendSomeJSON()
    ],
    otherwiss: [fail(406)]
  })
]
```

### addon/cors
```javascript
export default [
  cors('get, post', '*')
]
```

### addon/fail
```javascript
export default [
  loadWishlist(), {
    error: fail(404, 'Wishlist not found.')
  }
]
```

### addon/header
```javascript
export default [
  header({
    'Cache-Control': 'no-cache'
  })
]
```

### addon/method
```javascript
export default [
  method({
    get: [
      showWishlist()
    ],
    delete: [
      removeWishlist()
    ],
    otherwise: [
      fail(405)
    ]
  })
]
```

### addon/redirect
```javascript
export default [
  redirect('/redirect-target')
]
```

### addon/restEndpoint

Is required to be used with route.

```javascript
export default [
  route('/resource/:id?', [
    restEndpoint({
      list: [], // GET /resource
      show: [], // GET /resource/123
      create: [], // POST /resource
      update: [], // POST /resource/123
      clear: [], // DELETE  /resource
      remove: [] // DELETE  /resource/123
    })
  ])
]
```

Note to self: it should probably be combined in to:

```javascript
export default [
  restEndpoint('/resource/:id?', {
    list: [], // GET /resource
    show: [], // GET /resource/123
    create: [], // POST /resource
    update: [], // POST /resource/123
    clear: [], // DELETE  /resource
    remove: [] // DELETE  /resource/123
  })
]
```

### addon/route

The route addon uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) and merges the url params into `context.input`.

```javascript
export default [
  route({
    '/route/abc': [],
    '/with/:param/in-path': [],
    otherwise: [
      fail(404, 'Route not found.')
    ]
  })
]
```

### addon/show
```javascript
export default [
  createWishlist(),
  show('input.wishlist')
]
```

### addon/status
```javascript
export default [
  createWishlist(),
  status(201)
]
```

### addon/when
```javascript
export default [
  when('request.query.foo', {
    bar: [],
    otherwise: []
  })
]
```

[npm-image]: https://img.shields.io/npm/v/arnie.svg?style=flat
[npm-url]: https://npmjs.org/package/arnie
