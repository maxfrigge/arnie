import Koa from 'koa'
import arnie from '../lib/koa-arnie'
import wishlist from './routes/wishlist'

const app = new Koa()
app.use(arnie.action('/wishlist/:id?', wishlist))

let port = process.env.PORT || 8080
app.listen(port)

console.log(`Server running on port ${port}`)

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
