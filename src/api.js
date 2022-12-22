import { ACCESS_TOKEN, EXPIRES_IN, logout, TOKEN_TYPE } from "./common";
const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;
//Here Currently We aare just Fetching the data from base URL of spotify .
//So before we fetch the data we are checing wheathter the user is LogedIn or not
//  To check so :
//      1. So we authenticate the data we get , which is stored in localStorage so we , by checking that the current time with expirey of the access_token
//      2. If the current time is not expired then we return the accessToken and tokenType and then we authenticate these value by useing inbulid fetch header-Authentication
//

// FETCH API - and AUTHENTICATION PROCESS
//-------------------------------------------------------------------------------------
const getAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const expires_in = localStorage.getItem(EXPIRES_IN);
  const tokentype = localStorage.getItem(TOKEN_TYPE);
  if (Date.now() < expires_in) {
    return { accessToken, tokentype };
  } else {
    logout();
  }
};

const createAPIConfig = ({ accessToken, tokentype }, method = "GET") => {
  return {
    headers: {
      Authorization: `${tokentype} ${accessToken}`,
    },
    method,
  };
};
export const fetchRequest = async (endpoint) => {
  const url = `${BASE_API_URL}/${endpoint}`;
  const result = await fetch(url, createAPIConfig(getAccessToken()));
  //Remember that You can consume the ".json()" Only Once
  //example:
  //    1.  console.log(result.json());//
  //    2.  return result.json();
  //
  //  what's problem in here is:
  //    that line 1 is using the .json() and as we know "we can use .json() only once "
  //    the  line 2 will be unable to send the .json() and error will occur

  return result.json();
};

//-------------------------------------------------------------------------------------
