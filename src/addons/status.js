export default function (statusCode = 200) {
  return function status (ctx) {
    ctx.response.status = statusCode
  }
}
