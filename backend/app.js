const express = require('express');
const app = express();
const userRoute = require('./users/user.route');
const auth = require('./util/auth.validator')
const mongoose = require('mongoose');
const config = require('./config/config')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.mongoUrl,{ useUnifiedTopology: true ,useNewUrlParser:true})

app.use('/user',userRoute)


let server;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    
    server = app.listen(config.port,()=>{
        console.log(`App listening on port ${config.port}`);
    })
});

let exitHandler = () =>{
    if(server){
        server.close(()=>{
            console.log("server closed")
            process.exit(1)
        })

    }
    else{
        process.exit(1)
    }
}

process.on('unhandledRejection',exitHandler)
process.on('uncaughtException',exitHandler)


