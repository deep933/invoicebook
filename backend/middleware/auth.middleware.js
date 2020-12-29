const { catchAsync, errorHandler } = require('../util')
const { tokenService, tokenController } = require('../token');

const auth = catchAsync(async (req, res, next) => {
    const authTokens = req.cookies["auth"]; // recieve the auth tokens from cookies

    if (authTokens && authTokens.access && authTokens.access.token) {

        const payload = await tokenService.verifyToken(
            authTokens.access.token,
            "ACCESS",
            async (err) => {
                if (err.message.name === 'TokenExpiredError') {
                    await tokenController.refreshToken(req, res, next)
                }
                else {
                    await errorHandler(res, err)
                }
            });

        if (payload) {
            req.userId = payload.user
            next()
        }

    }
    else {
        await errorHandler(res, { status: 401 })
    }


})

module.exports = {
    auth
}