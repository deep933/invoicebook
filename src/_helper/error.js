class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (res, err) => {
  console.log(err)
  const error = err.statusCode ? err : { statusCode: 500, message: err.message }
  try {
    res.status(err.statusCode || 500).json(error)
    res.end()
  } catch (error) {
    res.status(500).json({ message: 'Unhandled Error' })
    res.end()
  }
}

module.exports = {
  handleError,
  ErrorHandler
}
