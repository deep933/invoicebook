import logo from './logo.svg';
import './App.css';
import {GoogleLogin} from 'react-google-login'

function App() {

const handleFailure = (dd) =>{
  console.log(dd)

}

const handleSuccess = async (googleData) =>{
  console.log(googleData)

  try{

  const res = await fetch("/auth/google", {
    method: "POST",
    body: JSON.stringify({
    token: googleData.tokenId
  }),
  headers: {
    "Content-Type": "application/json"
  }
})
const data = await res.json()
console.log(data)

  }
  catch(err){
    console.log(err)
  }
}
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        
        <GoogleLogin
    clientId='148770964011-vq1mqcjd0h777h7nlvigdo52d70e5la8.apps.googleusercontent.com'
    buttonText="Log in with Google"
    onSuccess={handleSuccess}
    onFailure={handleFailure}
    cookiePolicy={'single_host_origin'}
/>
       
      </header>
    </div>
  );
}

export default App;
