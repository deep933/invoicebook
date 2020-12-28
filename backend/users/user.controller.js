const userServices = require('./user.service')
const catchAsync = require('../util/catchAsync')

const createUser = catchAsync(async (req,res)=>{
    const user = await userServices.createUser(req.body)
    res.status(200).send(user)
})

module.exports = {
    createUser
}