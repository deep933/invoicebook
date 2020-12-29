const authServices = require("./auth.service");
const {catchAsync,httpErrors} = require("../util");


const signup = catchAsync(async (req, res) => {
  const token = await authServices.signupNewUser(req.body, (status, err) => {
    res.status(status).send(err);
    res.end();
  });
  if (token) {
    res.cookie("auth", token, {
      maxAge: token.refresh.exp.getTime(),
      httpOnly: true
    });
    res.status(200).send(token);
    res.end();
  }
});

const signin = catchAsync(async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  if(email && pass){
      const token = await authServices.signInWithEmailPassword(email,pass,(status,err)=>{
        res.status(status).send(err);
        res.end();
      })
      if (token) {
        res.cookie("auth", token, {
          maxAge: token.refresh.exp.getTime(),
          httpOnly: true
        });
        res.status(200).send(token);
        res.end();
      }

  }
  else{
    res.status(httpErrors.STATUS_401.status).send({...httpErrors.STATUS_500,message:"Required Email & Password"})

  }
});

const signout = catchAsync(async (req,res)=>{
    if(req.cookies['auth'] && req.cookies['auth'].refresh && req.cookies['auth'].refresh.token){
         const signout = await authServices.signout(req.cookies['auth'].refresh.token,(status,err)=>{
             res.status(status).send(err)
         })
         res.cookie("auth",{
            maxAge: 0
          });
         if(signout) res.status(httpErrors.STATUS_200.status).send('Logout Success')
         else res.status(httpErrors.STATUS_401.status).send(httpErrors.STATUS_401)
    }
    else{
        res.status(httpErrors.STATUS_404.status).send(httpErrors.STATUS_404)
    }
})

module.exports = {
  signup,
  signin,
  signout
};
