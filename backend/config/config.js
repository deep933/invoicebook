const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../.env") });

const envVarSchema = Joi.object().keys({
    NODE_ENV: Joi.string().valid("production", "development", "test").required(),
    PORT: Joi.number().default(3000),
    MONGO_URL: Joi.string().required().description("Mongo DB Url"),
    JWT_ACCESS_SECRET: Joi.string().required().description("JWT Access Sceret"),
    JWT_REFRESH_SECRET: Joi.string().required().description("JWT Refresh Sceret"),
    GOOGLE_CLIENT_ID: Joi.string().required().description("Google OAuth Client Id"),
});

const { value: envVars, error } = envVarSchema
    .prefs({ errors: { label: "key" } })
    .validate(process.env);

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoUrl: envVars.MONGO_URL,
    jwt: {
        accessExpirationMinutes: 2,
        refreshExpirationDays: 30,
        accessSecret: envVars.JWT_ACCESS_SECRET,
        refereshSecret: envVars.JWT_REFRESH_SECRET,
    },
    bcrypt: {
        saltRounds: 10,
    },
    google: {
        clientId: envVars.GOOGLE_CLIENT_ID,
    },
};
