const userServices = require("./user.service");
const { catchAsync, errorHandler, filter } = require("../util");

const getUser = catchAsync(async (req, res) => {
    if (req.userId) {
        const user = await userServices.getUser(req.userId, async (err) => {
            await errorHandler(res, err);
        });
        res.status(200);
        res.json(await filter.filterUser(user));
        res.end();
    } else {
        await errorHandler(res, { status: 401 });
    }
});

module.exports = {
    getUser
};
