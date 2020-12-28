var router = require('express').Router()



const auth = () => async (req,res,next) =>{
    console.log("sdsdd")
    return new Promise((resolve,reject)=>reject()).then(next()).catch(err=>next(err))
}

module.exports = auth
