const mongoose = require('mongoose')
const tokenSchema = require('./schemas/token.schema')

const Token = mongoose.model('Token', tokenSchema)

module.exports = Token
