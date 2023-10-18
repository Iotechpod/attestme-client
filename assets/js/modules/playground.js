
 // Add/Save a new Institution record
 $('#add-institution-record-form').on('submit', function(e) {
    e.preventDefault();     

    // Get form data and send it to the backend
    const formData = $(this).serialize();
    // verify formData is collected 
    // console.log('Form submitted:', formData);

    $.ajax({
        url: 'http://127.0.0.1:8000/attest/institution/?format=datatables',
        type: 'POST',
        data: formData,
        success: function(response) {
            console.log(response.data);
            // success alert
            Swal.fire({
                icon: 'success',
                title: 'Record Added!',
                text: 'The new institution record has been added successfully.',
            });
            // Reloads the DataTable to reflect the changes
            institutionTable.ajax.reload(); 
            // Reset the form
            $('#add-institution-record-form')[0].reset();

            // Close the modal
            $('#addInstitutionModal').modal('hide');
            // Update DataTable with the new data
            //institutionTable.row.add(response).draw(false);
            // Assuming 'response' contains the newly added data
        },
        error: function(error) {
            console.error('Error:', error);
            //error alert
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong. Please try again later.',
            });

        }
    });

});
    // End: Add/Save a new Institution record

// Dashboard: Calls the dashboard endpoint
async function dashboard() {
    // main.js
    try{
         await axios.get('http://127.0.0.1:8000/dashboard/home/')
             .then(response => {
                //console.log('Response received:', response);
                // const totalRecords = response.data.total_records; // Assuming your response has a property 'total_records'
                // $('#total-records').text('Total Records: ' + totalRecords);

                const institutionData = response.data.dashboard.attest; // Extracting institution data
                const totalInstitutions = institutionData.institution;

                //display the total institution
                $('#total-institutions').text(totalInstitutions);
            })
            .catch(error => {
                // Handle error
                console.error('Error:', error);
            });
        
        }catch {
            //write code
        }
        
}



    // Using If-else: Update form submit event handler
$('#add-institution-record-form').on('submit', function(e) {
    e.preventDefault();

    // Assuming you have the institution ID stored in selectedRowData.id
    const institutionID = selectedRowData.id;

    if (institutionID) {
        // Update an existing Institution record
        const formData = $(this).serialize();

        $.ajax({
            url: `http://127.0.0.1:8000/attest/institution/${institutionID}/?format=datatables`,
            type: 'PUT',  
            data: formData,
            success: function(response) {
                institutionTable.ajax.reload();
                $('#addInstitutionModal').modal('hide');
                Swal.fire({
                    icon: 'success',
                    title: 'Record Updated',
                    showConfirmButton: false,
                    timer: 1500
                });
            },
            error: function(error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Updating Record',
                    text: 'An error occurred while updating the record. Please try again.',
                });
            }
        });
    } else {
        // Add/Save a new Institution record
        const formData = $(this).serialize();

        $.ajax({
            url: 'http://127.0.0.1:8000/attest/institution/?format=datatables',
            type: 'POST',
            data: formData,
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Record Added!',
                    text: 'The new institution record has been added successfully.',
                });
                institutionTable.ajax.reload(); 
                $('#add-institution-record-form')[0].reset();
                $('#addInstitutionModal').modal('hide');
            },
            error: function(error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again later.',
                });
            }
        });
    }
});


// Update form submit event handler
$('#update-institution-record-form').on('submit', function(e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Get the ID of the selected institution
    const institutionID = institutionTable.rows({ selected: true }).data()[0].id;

    // Serialize the form data
    const formData = $(this).serialize();

    // Send an AJAX request to update the institution record
    $.ajax({
        // The URL where the update request will be sent
        url: `http://127.0.0.1:8000/attest/institution/${institutionID}/?format=datatables`,
        
        // Use the HTTP PUT method for updates
        type: 'PUT',
        
        // The data to be sent in the request
        data: formData,

        // If the request is successful
        success: function(response) {
            // Reload the DataTable to reflect the changes
            institutionTable.ajax.reload();

            // Hide the update institution modal
            $('#updateInstitutionModal').modal('hide');

            // Show a success message to the user
            Swal.fire({
                icon: 'success',
                title: 'Record Updated',
                showConfirmButton: false,
                timer: 1500
            });
        },

        // If there is an error in the request
        error: function(error) {
            // Log the error to the console
            console.error('Error:', error);

            // Show an error message to the user
            Swal.fire({
                icon: 'error',
                title: 'Error Updating Record',
                text: 'An error occurred while updating the record. Please try again.',
            });
        }
    });
});

//Using AJAX for login
$(document).ready(function() {
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();

        $.ajax({
            url: 'http://127.0.0.1:8000/api/token/',
            type: 'POST',
            data: {
                username: username,
                password: password
            },
            success: function(response) {
                // Handle successful login
                console.log('Login successful:', response);
                // You might want to redirect the user or perform other actions here
            },
            error: function(error) {
                // Handle login error
                console.error('Error:', error);
                // Display an error message to the user
            }
        });
    });
});

//Sets tokens 
axios.post('http://127.0.0.1:8000/api/token/', {
    username: username,
    password: password
})
.then(function (response) {
    // Store tokens in local storage
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    console.log('Login successful:', response);
})
.catch(function (error) {
    console.error('Error:', error);
});



//Login: handles user login
$('#login-form').on('submit', async function(e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    try{
        await axios.post('http://127.0.0.1:8000/api/token/', {
            email: email,
            password: password
        })
        .then(function (response) {
            // Handle successful login
            console.log('Login successful:', response);

            // You might want to redirect the user or perform other actions here
            // Store tokens in local storage
            const authTokens = {
                access: response.data.access,
                refresh: response.data.refresh
            };

            // Store the authentication token (e.g., in browser cookies or local storage)
            // Example using local storage:
            localStorage.setItem('authTokens', JSON.stringify(authTokens));

            // Redirect to the dashboard or home page
            window.location.href = '/dashboard.html'; // Adjust the URL as needed
        })
        .catch(function (error) {
            // Handle login error
            console.error('Error:', error);
            // Display an error message to the user
        });

    }catch {

    }

});
// End: Login: handles user login

// function logout() {
//     // Clear authentication tokens from local storage
//     localStorage.removeItem('authTokens');

//     // Clear authentication tokens from local storage
//     // localStorage.removeItem('access');
//     // localStorage.removeItem('refresh');

//     // Redirect the user to the login page
//     window.location.href = '/login.html'; // Replace '/login' with your actual login page URL
// }

// function populateTable(data) {
//     console.log('Populating table with data:', data);
//     const table = $('#data-table').DataTable();
//     table.clear().rows.add(data).draw();
// }


// dataSrc is an option provided by DataTables to specify where it should look for the actual data in 
// the response received from the server.This can be useful if the data is nested under a
// particular property in the JSON response.


// $('#add-institution-record-form')[0].reset(); is essentially saying 
// "Select the first DOM element with the id add-institution-record-form, and call its reset() method."


// Note: Await/Async

// I'm glad to hear that the data is now being displayed! 
// Let me explain why the previous code might not have worked as expected.

// In the initial version of `loadDashboardContent`, you were making an Axios GET request to the dashboard endpoint. 
// However, Axios requests are asynchronous by nature, meaning they do not block the execution of the rest of your code. 

// In the original version, the Axios request was made, but the code continued to execute without 
// waiting for the response. This could lead to the rest of the function (including trying 
// to access `response.data.dashboard.attest`) executing before the response was received. 
// Since the response hadn't arrived yet, `response` was likely `undefined` or incomplete, leading to issues.

// By using `async/await` in the updated version, you explicitly tell JavaScript to pause execution until the 
// promise returned by `axios.get` is resolved. This ensures that you have the complete response object 
// before trying to access its properties like `response.data.dashboard.attest`.

// In summary, using `async/await` helps you work with asynchronous operations in a more synchronous manner, 
// making it easier to manage the flow of your code when dealing with network requests or other asynchronous tasks.

// If you have any further questions or if there's anything else you'd like to discuss, 
// feel free to let me know!


