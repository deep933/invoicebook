const { userServices } = require('../services')
const { catchAsync, handleError, ErrorHandler, filter } = require('../_helper')

module.exports = {
  getUser: catchAsync(async (req, res) => {
    try {
      if (req.userId) {
        const user = await userServices.getUser(req.userId)
        res.status(200)
        res.json(filter.filterUser(user))
        res.end()
      } else {
        handleError(res, new ErrorHandler(401, 'Unauthorized access'))
      }
    } catch (error) {
      handleError(res, error)
    }
  })
}
