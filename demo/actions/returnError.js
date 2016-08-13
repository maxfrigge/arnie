export default function returnError (ctx, { error }) {
  ctx.status = error.status
  ctx.body = {
    error: error.message,
    success: false
  }
}
