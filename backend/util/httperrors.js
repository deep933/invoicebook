const STATUS_401 = {
    status:401,
    error:"Unauthorized Access"
}

const STATUS_409 = {
    status:409,
    error:"There is some conflict"
}


const STATUS_404 = {
    status:404,
    error:"Not Found"
}

const STATUS_500 = {
    status:500,
    error:"Internal Server Error"
}

module.exports ={
    STATUS_401,
    STATUS_409,
    STATUS_500,
    STATUS_404
}