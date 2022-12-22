import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common";

//Defining the Essentials
const Client_ID = import.meta.env.VITE_CLIENT_ID;
const Redirect_Uri = import.meta.env.VITE_REDIRECT_URI;
const App_Url = import.meta.env.VITE_APP_URL;
const Scope =
  "user-top-read user-follow-read playlist-read-private user-library-read";

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Autherizing the User
const AutherizeUser = () => {
  const url = `https://accounts.spotify.com/authorize?client_id=${Client_ID}&response_type=token&redirect_uri=${Redirect_Uri}&scope=${Scope}&show_dialog=true`;
  window.open(url, "login", "width=800,height=800");
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Login Button function
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-to-spotify");
  loginButton.addEventListener("click", AutherizeUser);
});

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Stroing the Essentials we get back from Spotify in LocalStorages .
window.setItemsInLocalStorage = ({ accessToken, tokenType, expiresIn }) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(TOKEN_TYPE, tokenType);
  localStorage.setItem(EXPIRES_IN, Date.now() + expiresIn * 1000);
  console.log(accessToken, expiresIn, tokenType);
  window.location.href = App_Url;
};

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

//On Loading : KAfter the verification or account creation closing the popup window..
// check for errors..
// if no error then, confirming the login and re directing to Dashboard
// getting the accessCode ,tokentype, expiresIn (Link expiry) credential provided by spotify on succesfull login>

window.addEventListener("load", () => {
  const AccessToken = localStorage.getItem(ACCESS_TOKEN); //Storing the AccessTokenKey
  if (AccessToken) {
    window.location.href = `${App_Url}/dashboard/dashboard.html`;
  }
  //chekcing wheather the windoew is closed?
  if (window.opener !== null && !window.opener.closed) {
    window.focus();

    if (window.location.href.includes("error")) {
      window.close();
    }

    //Accessing and Storing the Data provided in AccessTokenKey
    const { hash } = window.location;
    console.log(hash);
    const searchParams = new URLSearchParams(hash);
    const accessToken = searchParams.get("#access_token");
    const tokenType = searchParams.get("token_type");
    const expiresIn = searchParams.get("expires_in");

    //PAssing the Data to setIteminlocalStorage to set these above values.
    if (accessToken) {
      window.close();
      window.opener.setItemsInLocalStorage({
        accessToken,
        tokenType,
        expiresIn,
      });
    } else {
      window.close();
    }
  }
});
