// Just for ease of use when importing
module.exports = {
  accepts: require('./dist/addons/accepts').default,
  cors: require('./dist/addons/cors').default,
  fail: require('./dist/addons/fail').default,
  header: require('./dist/addons/header').default,
  method: require('./dist/addons/method').default,
  redirect: require('./dist/addons/redirect').default,
  restEndpoint: require('./dist/addons/restEndpoint').default,
  route: require('./dist/addons/route').default,
  show: require('./dist/addons/show').default,
  status: require('./dist/addons/status').default,
  when: require('./dist/addons/when').default
}
