const jwt = require("jsonwebtoken");
const moment = require("moment");
const Token = require("./token.model");
const { OAuth2Client } = require("google-auth-library");
const { config } = require("../config");

const generateToken = async (user, expires, secret, type) => {
    let payload = {
        user: user._id,
        exp: expires.unix(),
        iat: moment().unix(),
        type: type,
    };

    return await jwt.sign(payload, secret);
};

const saveToken = async (token, user, expires, type, blacklisted = false) => {
    return await Token.create({
        token,
        userId: user._id,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
};

const verifyToken = async (token, type, cb) => {
    if (type === "ACCESS") {
        try {
            return await jwt.verify(token, config.jwt.accessSecret);
        } catch (err) {
            cb({ status: 401, message: err });
        }
    }

    if (type === "REFRESH") {
        try {
            return await Token.findOne({ token: token });
        } catch (err) {
            cb({ status: 401, message: err });
        }
    }
};

const generateAuthTokens = async (user) => {
    const accessTokenExpires = moment().add(
        config.jwt.accessExpirationMinutes,
        "minutes"
    );

    const accessToken = await generateToken(
        user,
        accessTokenExpires,
        config.jwt.accessSecret,
        "ACCESS"
    );

    const refreshTokenExpires = moment().add(
        config.jwt.refreshExpirationDays,
        "days"
    );

    const refreshToken = await generateToken(
        user,
        refreshTokenExpires,
        config.jwt.refereshSecret,
        "REFRESH"
    );

    await saveToken(refreshToken, user, refreshTokenExpires, "REFRESH");

    return {
        access: {
            token: accessToken,
            exp: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            exp: refreshTokenExpires.toDate(),
        },
    };
};

const generateRefreshToken = async (user, refreshToken) => {
    const accessTokenExpires = moment().add(
        config.jwt.accessExpirationMinutes,
        "minutes"
    );

    const accessToken = await generateToken(
        user,
        accessTokenExpires,
        config.jwt.accessSecret,
        "ACCESS"
    );

    return {
        access: {
            token: accessToken,
            exp: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken.token,
            exp: refreshToken.expires,
        },
    };
};

const deleteAllUserTokens = async (userId) => {
    await Token.deleteMany({ userId: userId });

};

const verifyGoogleAuthToken = async (token, errCb) => {
    const client = new OAuth2Client(config.google.clientId);
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: config.google.clientId,
        });

        return ticket.getPayload();
    } catch (err) {
        errCb({ status: 401, message: "Invalid/Expired Auth Token", });
    }
};

module.exports = {
    generateAuthTokens,
    saveToken,
    generateToken,
    verifyToken,
    generateRefreshToken,
    deleteAllUserTokens,
    verifyGoogleAuthToken,
};
