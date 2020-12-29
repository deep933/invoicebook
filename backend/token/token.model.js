const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            index: true
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "User",
            required: true
        },
        expires: {
            type: Date,
            required: true
        },
        type: {
            type: String,
            enum: ["ACCESS", "REFRESH"],
            required: true
        },
        invalidated: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
