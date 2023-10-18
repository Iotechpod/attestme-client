
import { login } from './core/authentication.js';

$(document).ready(function() {

    //Login: handles user login
    $('#login-form').on('submit', async function(e) {

        e.preventDefault();
        const email = $('#email').val();
        const password = $('#password').val();

        login(email, password)
            .then(function (loginResponse) {
                // Handle successful login
                console.log('Login successful:', loginResponse);
                // Redirect to the dashboard or home page
                window.location.href = '/dashboard.html'; // Adjust the URL as needed
            })
            .catch(function (error) {
                    console.error('Error:', error);
                    // Display an error message to the user
                });
            });
    // End: Login: handles user login

});