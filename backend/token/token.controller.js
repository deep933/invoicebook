const tokenService = require("./token.service");
const { catchAsync, errorHandler } = require("../util");

const refreshToken = catchAsync(async (req, res, next) => {
    if (req.cookies["auth"] && req.cookies["auth"].refresh.token) {
        const token = await tokenService.verifyToken(
            req.cookies["auth"].refresh.token,
            "REFRESH",
            async (err) => {
                await errorHandler(res, err);
            }
        );

        if (token && token.userId && !token.invalidated) {
            const newToken = await tokenService.generateRefreshToken(
                { _id: token.userId },
                token
            );
            res.cookie("auth", newToken, {
                maxAge: newToken.refresh.exp.getTime(),
                httpOnly: true,
            });
            req.userId = token.userId;
            next();

        } else {
            await errorHandler(res, { status: 401, message: "Invalid/Expired Token" })
        }
    } else {
        await errorHandler(res, { status: 401 })

    }
});

module.exports = {
    refreshToken,
};
