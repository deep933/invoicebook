const dotenv = require('dotenv');
const path = require('path')
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid('production','development','test').required(),
    PORT:Joi.number().default(3000),
    MONGO_URL:Joi.string().required().description('Mongo DB Url'),
    JWT_SECRET:Joi.string().required().description('JWT Sceret')
})

const { value: envVars, error } = envVarSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

module.exports = {
env:envVars.NODE_ENV,
port:envVars.PORT,
mongoUrl:envVars.MONGO_URL,
jwt:{
    ExpirationMinutes:30,
    Secret:envVars.JWT_SECRET
}
}