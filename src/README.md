# KOA Arnie

**A real action hero for Koa2 - inspired by [CerebralJS](http://www.cerebraljs.com/)**

Arnie sits restless and wants action! Actions are structured in chains and you compose them like legos to make things happen. Here is what an action chain looks like.

```javascript
const getWishlist [
  enableCors,
  loadWishlist, {
    wishlist: [
      outputWishlist
    ],
    error: [
      outputError
    ]
  }
]
```

Guess you already grasp what this chain does just from reading it and that's the whole point here. Arnie is not about writing magic code with super powers - he is all about expressing complex things with simple words.

## Folder structure

This sample structure will be used throughout the docs and is a good way to start structuring your project.

```
src/
├── actions/
│   ├── loadWishlist.js
│   └── saveWishlist.js
├── chains/
│   ├── getWishlist.js
│   └── postWishlist.js
├── factories/
│   ├── cors.js
│   └── output.js
├── routes/
│   └── wishlist.js
└── main.js
```

## Routing chains

URLs are mapped to action chains with [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

```javascript
import getWishlist from './chains/getWishlist'

const app = new Koa()

app.use(
  arnie.on('/wishlist/:id', 'get').action(getWishlist)
)

app.listen(8080)
```

Setting the request method is optional and will default to any method.

## Building chains

Chains are defined in arrays an consist of three things

- **Actions** are defined in functions
- **Paths** are defined by objects
- **Chains** are defined in arrays

Yes chains can contain other chains :)

Enough with the smart talk - here's the code.

```javascript
// src/main.js
import getWishlist from './chains/getWishlist'

const app = new Koa()
app.use(
  arnie.on('/wishlist/:id', 'get').action(getWishlist)
)

app.listen(8080)

// src/chains/getWishlist.js
import enableCors from '../actions/enableCors'
import loadWishlist from '../actions/loadWishlist'
import outputWishlist from '../actions/outputWishlist'

export default [
  enableCors,
  loadWishlist, {
    wishlist: [ // Define path "wishlist"
      outputWishlist
    ]
  }
]

// src/actions/enableCors.js
export function enableCors (ctx, payload) {
  ctx.set('Access-Control-Allow-Methods', 'get')
  ctx.set('Access-Control-Allow-Origin', ctx.get('origin') || '*')
}

// src/actions/loadWishlist.js
export async function loadWishlist (ctx, payload) {
  const collection = db.collection('wishlist')
  const wishlist = await collection.find({id: payload.id})

  return { // Merge wishlist into payload and trigger path "wishlist"
    wishlist
  }
}

// src/actions/outputWishlist.js
export default function outputWishlist (ctx, payload) {
  ctx.body = {
    wishlist: payload.wishlist
  }
}
```

## Using paths

You have already seen a path definition and trigger in the example above - let's take a closer look.

You define paths with objects that follow actions within a chain.

```javascript
const actionChain [
  loadWishlist, {
    wishlist: [ // Define path "wishlist"
      outputWishlist
    ],
    error: [ // Define path "error"
      outputError
    ]
  }
]
```

A path gets triggered when an action returns an object with a key that matches a path definition.

```javascript
async function loadWishlist (ctx, payload) {
  try {
    const collection = db.collection('wishlist')
    const wishlist = await collection.find({id: payload.id})
    return { wishlist } // Triggers path "wishlist"
  } catch (error) {
    return { error } // Triggers path "error"
  }
}
```

## Action arguments

Each action gets two arguments.

```javascript
function (ctx, payload) {
  ctx // Koa context
  payload // Payload passed to action
}
```

You should already know the [Koa context](https://github.com/koajs/koa/blob/v2.x/docs/api/context.md).

The payload passed to an action will initially be an object that carries all route parameters.

```javascript
// route: '/wishlist/:id'
// url: '/wishlist/123'
function (ctx, payload) {
  payload.id // 123
}
```

Each object returned by an action will be merged (shallow) into the payload.

```javascript
// route: '/wishlist/:id'
// url: '/wishlist/123'
function (ctx, payload) {
  payload // {id: '123'}

  return {
    foo: 'bar'
  }
}

// subsequent actions will get
function (ctx, payload) {
  payload // {id: '123', foo: 'bar'}
}
```

## Using factories

Factories can be very powerful when trying to reduce boilerplate code.

```javascript
// factories/output.js
export default function output (property) {
  return (ctx, input) => {
    ctx.body[property] = input[property]
  }
}

// factories/cors.js
export default function cors (methods, origin = '*') {
  return (ctx) => {
    ctx.set('Access-Control-Allow-Methods', methods)
    ctx.set('Access-Control-Allow-Origin', ctx.get('origin') || origin)
  }
}

// src/chains/getWishlist.js
import cors from '../factories/cors'
import output from '../factories/output'
import loadWishlist from '../actions/loadWishlist'

export default [
  cors('get, post'),
  loadWishlist, {
    wishlist: [
      output('wishlist')
    ],
    error: [
      output('error')
    ]
  }
]
```

Don't think about factories to much in the beginning. Just start hacking away and you will soon realise where and when a factory will help you organise your code.

## Using operators

Operators can further reduce boilerplate code - thanks to a British lad in Cerebral land :)

### when

```javascript
// src/routes/wishlist.js
import { when } from 'koa-arnie/operators'
import cors from '../factories/cors'
import getWishlist from '../chains/getWishlist'
import postWishlist from '../chains/postWishlist'

export default [
  cors('get, post, options'),
  ...when('ctx:request.method', {
    get: getWishlist,
    post: postWishlist
  })
]

// src/main.js
import wishlist from './routes/wishlist'

const app = new Koa()
app.use(
  arnie.on('/wishlist/:id?').action(wishlist)
)

app.listen(8080)
```

### output

```javascript
// src/chains/getWishlist.js
import { output } from 'koa-arnie/operators'
import loadWishlist from '../actions/loadWishlist'

export default [
  loadWishlist, {
    wishlist: [
      output({ wishlist: 'payload:wishlist' })
    ]
  }
]
```

TODO: Create output operator and write docs
