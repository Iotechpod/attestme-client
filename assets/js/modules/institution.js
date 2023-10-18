//console.log('Code executed!');

$(document).ready(function() {

    let selectedRowData;


    
    //Institution data table - Initialize DataTables
    let institutionTable = $('#institution-data-table').DataTable({
        dom: "Bfrtip",
        buttons: [
            {
                extend: 'copy',
                text: 'Copy',
            },
            'excel',
            'pdf',
            'print'
        ],
        processing: true,
        serverSide: true,
        ajax: {
            url: 'http://127.0.0.1:8000/attest/institution/?format=datatables',
            type: 'GET',
            dataSrc: function (json) {
                $('#total-institutions').text(json.recordsTotal); // Update the total records count
                console.log(json);
                return json.data; // Assuming the actual data is nested under 'data'
            },
            data: function (data) {
                console.log(data);
                //return data
                //return JSON.stringify(data);
              }
        },
        columns: [

            { 
                data: 'id',
                name: 'id',
            },
            { 
                data: 'name',
                name: 'name',
            },
            { 
                data: 'location',
                name: 'location',
            },
            { 
                data: 'established_year',
                name: 'established_year',
                render: function(data, type, row, meta) {
                    return data.toString();; // Assuming it's already in the correct format
                }
            },
            { 
                data: 'website', 
                name: 'website',
                render: function(data, type, row, meta) {
                    return '<a href="' + data + '" target="_blank">' + data + '</a>';
                }
            },
        ], 
        select: true,
        searching: true,
        // Enable Pagination
        paging: true,
        // Set the number of rows per page
        pageLength: 10, // Adjust this as needed
        //responsive: true,
        //destroy: true,

    });
    // End: Institution data table - Initialize DataTables


   // Add/Save new Institution record
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


    // Save and reset form to add a new record
    $('#saveAndCreateNew').on('click', function() {
        // Get form data and send it to the backend
        const formData = $('#add-institution-record-form').serialize();

        $.ajax({
            url: 'http://127.0.0.1:8000/attest/institution/?format=datatables',
            type: 'POST',
            data: formData,
            success: function(response) {
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
            },
            error: function(error) {
                console.error('Error:', error);
                // error alert
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong. Please try again later.',
                });
            }
        });
    });
    //End: Save and reset form to add a new record


    // Update button: Event listener for row selection
    institutionTable.on('select', function (e, dt, type, indexes) {
        $('#updateRecord').prop('disabled', false); // Enable the update button
    });

    // Update button: Event listener for row deselection
    institutionTable.on('deselect', function (e, dt, type, indexes) {
        if (institutionTable.rows({ selected: true }).count() === 0) {
            $('#updateRecord').prop('disabled', true); // Disable the update button if no rows are selected
        }
    });

    // Get data of selected row
    $('#updateRecord').click(function() {

        // Check if a row is selected
        if (institutionTable.rows({ selected: true }).any()) {
            // Get the data of the selected row
            selectedRowData = institutionTable.rows({ selected: true }).data()[0];
            //console.log(selectedRowData.id);


            // Populate the form fields with the data
            // Update the established_year field in the form using "name" attribute instead of "id"
            $('#update_name').val(selectedRowData.name);
            $('#update_location').val(selectedRowData.location);
            $('input[name="established_year"]').val(selectedRowData.established_year);
            $('#update_website').val(selectedRowData.website);
            
            // Open the modal form
            $('#updateInstitutionModal').modal('show');
            //$('#established_year').val(selectedRowData.established_year);
        }
    
    });
    // End: Get data of selected row


    // Update record from form submit event handler
    $('#update-institution-record-form').on('submit', function(e) {

        // Prevent the default form submission behavior
        e.preventDefault();

        // Get the ID of the selected institution
        const institutionID = institutionTable.rows({ selected: true }).data()[0].id;
        // Serialize the form data
        const formData = $(this).serialize();

        // Send an AJAX request to update the institution record
        $.ajax({
            url: `http://127.0.0.1:8000/attest/institution/${institutionID}/?format=datatables`,
            type: 'PUT',
            data: formData,
            success: function(response) {
                // Reload the DataTable to reflect the changes
                institutionTable.ajax.reload();
                $('#updateInstitutionModal').modal('hide');
                Swal.fire({
                    icon: 'success',
                    title: 'Record Updated',
                    showConfirmButton: false,
                    timer: 1500
                });

                // Disable the update button after a successful update
                $('#updateRecord').prop('disabled', true);
                // Unselect the row after update/delete
                institutionTable.rows({ selected: true }).deselect();
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
    });
    // End: Update record in form submit event handler
      

    // Delete button: Event listener for row selection
    institutionTable.on('select', function (e, dt, type, indexes) {
        $('#deleteRecord').prop('disabled', false); // Enable the update button
    });

    // Delete button: Event listener for row deselection
    institutionTable.on('deselect', function (e, dt, type, indexes) {
        if (institutionTable.rows({ selected: true }).count() === 0) {
            $('#deleteRecord').prop('disabled', true); // Disable the update button if no rows are selected
        }
    });

    // Delete record from database
    $('#deleteRecord').click(function() {
        // Get the selected row data
        let selectedRowData = institutionTable.rows({ selected: true }).data()[0];
        
        if (selectedRowData) {
            // Show a confirmation modal
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this record!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // User confirmed deletion
                    const institutionID = selectedRowData.id;
    
                    // Send a DELETE request to the server
                    $.ajax({
                        url: `http://127.0.0.1:8000/attest/institution/${institutionID}/?format=datatables`,
                        type: 'DELETE',
                        success: function(response) {
                            institutionTable.ajax.reload();
                            Swal.fire({
                                icon: 'success',
                                title: 'Record Deleted',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            // Disable the delete button
                            $('#deleteRecord').prop('disabled', true);
                            // Unselect the row after update/delete
                            institutionTable.rows({ selected: true }).deselect();
                            // Disable the update button after a successful delete
                            $('#updateRecord').prop('disabled', true);

                        },
                        error: function(error) {
                            console.error('Error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Error Deleting Record',
                                text: 'An error occurred while deleting the record. Please try again.',
                            });
                        }
                    });
                }
            });
        }
    });
    // End: Delete record from database
      

        
    
});

// Notes: 


   // Event handler for when a row is selected/deselected
    // institutionTable.on('select', function (e, dt, type, indexes) {
    //     if (type === 'row') {
    //         selectedRowData = institutionTable.rows(indexes).data()[0];
    //         $('#updateRecord').prop('disabled', false);
    //     }
    //     else if (type === 'rowUnselected') {
    //         selectedRowData = null;
    //         $('#updateRecord').prop('disabled', true);
    //     }
    // });



 // Select and deselect code... works with checkbox
    // // Disable Update Button by Default
    // $('#updateRecord').prop('disabled', true);

    // // Enable Update Button on Selection
    // $('#institution-data-table tbody').on('change', '.rowCheckbox', function () {
    //     const selectedRows = $('input.rowCheckbox:checked');
    //     if (selectedRows.length > 0) {
    //         $('#updateRecord').prop('disabled', false);
    //     } else {
    //         $('#updateRecord').prop('disabled', true);
    //     }
    // });



// Assuming you have a form with the id 'add-record-form'
// Assuming your DataTables API response contains 'recordsTotal'
    //let totalRecords = institutionTable.page.info().recordsTotal;

    // Update the content of the element with id 'total-records'
    //$('#total-records').text('Total Records: ' + totalRecords);  


// $.ajax({
    //     url: 'http://127.0.0.1:8000/attest/institution/count',
    //     type: 'GET',
    //     success: function(data) {
    //         // Assuming the response is a JSON object with a 'count' property
    //         var totalInstitutions = data.count;
    //         // Update a DOM element with the total count
    //         $('#total-count').text('Total Institutions: ' + totalInstitutions);
    //     }
    // });



   