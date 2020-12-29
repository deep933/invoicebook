const express = require("express");
const app = express();
const userRoute = require("./users/user.route");
const mongoose = require("mongoose");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const authRoute = require("./auth/auth.route");
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(config.mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

app.use('/', express.static(path.join(__dirname, 'frontend', 'build')))

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/*", (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html')).end()
})

let server;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    server = app.listen(config.port, () => {
        console.log(`App listening on port ${config.port}`);
    });
});

let exitHandler = () => {
    if (server) {
        server.close(() => {
            console.log("server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

process.on("unhandledRejection", exitHandler);
process.on("uncaughtException", exitHandler);
