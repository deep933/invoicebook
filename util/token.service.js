const jwt = require('jsonwebtoken')
const moment = require('moment')
const config = require('../config/config')

const generateAccessToken = async (user) =>{
let payload = {
    user,
    exp: moment().add(config.jwt.ExpirationMinutes,'minutes').unix(),
    iat: moment().unix(),
    type:'access',
}

console.log(config.jwt.Secret)
return await jwt.sign(payload,config.jwt.Secret,{expiresIn:moment().add(config.jwt.ExpirationMinutes,'minutes').unix()})
}

const generateAuthTokens = async (user) =>{
    
}

module.exports ={
    generateToken
}