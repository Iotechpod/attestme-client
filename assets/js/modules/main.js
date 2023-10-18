// main.js
// import axios from 'axios';
// const axios = require('axios');

// imports authentication functions from authentication.js
import { isAuthenticated, logout, checkAuthentication } from './core/authentication.js';

$(document).ready(async function() {
    checkAuthentication();
    loadDashboardContent();

   //Logout Button
     $('#logout').click(function() {
        logout();
        window.location.href = '/login.html'; 
    });    
    //End: Logout button
});

 
// Dashboard: Calls the dashboard endpoint
async function loadDashboardContent() {
    const authTokens = JSON.parse(localStorage.getItem('authTokens'));

    if (!authTokens || !authTokens.access) {
        // User is not authenticated, handle this case as needed
        return;
    }

    const headers = {
        Authorization: `Bearer ${authTokens.access}`
    };

    try {
        const response = await axios.get('http://127.0.0.1:8000/dashboard/home/', { headers });
        console.log('Response received:', response);

        // Extracting institution data
        const institutionData = response.data.dashboard.attest; 
        const totalInstitutions = institutionData.institution;

        // Display the total institution
        $('#total-institutions').text(totalInstitutions);
    } catch (error) {
        // Handle error
        console.error('Error:', error);
    }
}
//End: Dashboard
