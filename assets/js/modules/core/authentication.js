// import axios from 'axios';
//const axios = require('axios');



// assets/js/modules/authentication.js
export async function login(email, password) {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/token/', {
            email: email,
            password: password
        });

        const authTokens = {
            access: response.data.access,
            refresh: response.data.refresh
        };
        // Store the authentication token (e.g., in browser cookies or local storage)
        localStorage.setItem('authTokens', JSON.stringify(authTokens));

        return response.data; // Return data if needed
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
}

// authentication.js
// getToken function
export const getToken = () => {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    return authTokens ? authTokens.access : null;
};

// checks if user is authenticated
export const isAuthenticated = async () => {
    const token = getToken();

    if (token) {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            await axios.get('http://127.0.0.1:8000/api/token/', { headers });
            return true;
        } catch (error) {
            console.error('Error validating token:', error);
        }
    }

    return false;
};
// checks authentication to verify if user is not logged in 
export function checkAuthentication() {
  
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));

    if (!authTokens || !authTokens.access) {
        window.location.href = '/login.html';
    }

}

//Log out function
export function logout() {
    localStorage.removeItem('authTokens');
    //localStorage.clear(); // Clear all items from localStorage
}
//End: Logout function



// checks authentication to verify if user is not logged in 
// export function checkAuthentication() {
//     const authTokens = JSON.parse(localStorage.getItem('authTokens'));
//     if (!authTokens || !authTokens.access) {
//         return false; // User is not authenticated
//     }
//     return true; // User is authenticated
// }