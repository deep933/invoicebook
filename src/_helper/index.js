module.exports = {
  filter: require('./filter'),
  handleError: require('./error').handleError,
  ErrorHandler: require('./error').ErrorHandler,
  config: require('./config'),
  catchAsync: require('./catchAsync')
}
