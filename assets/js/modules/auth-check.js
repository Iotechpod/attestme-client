// auth-check.js
// To verify if the tokens have been stored, on every page
//import { checkAuthentication } from './authentication.js';

$(document).ready(function() {

   const authTokens = JSON.parse(localStorage.getItem('authTokens'));

   //checks and verifies if token exist and stores it 
   if (authTokens) {
       const accessToken = authTokens.access;
       const refreshToken = authTokens.refresh;
       console.log('Access Token:', accessToken);
       console.log('Refresh Token:', refreshToken);

       // Here you can add additional checks if needed, like token expiration, etc.

   } else {
       console.log('Tokens not found in local storage');
       // Redirect to login page or take necessary action for unauthenticated user
   }
});
