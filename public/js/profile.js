/* global $ */

$(document).ready(function() {
    var url = 'https://thebookstrade-br4in.c9users.io'
    
    // Get user data
    var user_id;
    $.getJSON(url+'/data', function(data) {
        user_id = data.user._id;
        // Insert user values into the form, if they exist
        if (data.user.local.city) {
            $('input[name="city"]').val(data.user.local.city);
        }
        if (data.user.local.state) {
            $('input[name="state"]').val(data.user.local.state);
        }
        if (data.user.local.username) {
            $('input[name="username"]').val(data.user.local.username);
        }
    });
    
    $('#updateProfileForm').submit(function(event) {
        event.preventDefault();
        var values = {};
        $.each($('#updateProfileForm').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        values.id = user_id;
        console.log(JSON.stringify(values));
        // Submit
        $.post(url+'/updateProfile', values, function(data) {
            // Process data
        });
    });
    
    // Switch button controls
    $('input[name="onoffswitch"]').click(function() {
              // this will contain a reference to the checkbox   
        if (this.checked) {
            // the checkbox is now checked
            $('#profile-settings').hide();
            $('#profile').show();
        } else {
            // the checkbox is now no longer checked
            $('#profile').hide();
            $('#profile-settings').show();
        }
    });
    
    // Get all books owned by the user
    $.getJSON('https://thebookstrade-br4in.c9users.io/ownedBooks', function(data) {
        console.log(JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            var div = `
            <div class="book-div"><a href="/test">
            <img class="book-img" src="`+data[i].cover+`">
            </a></div>
            `;
            $('#my-books').append(div);
        }
    });
    
});