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
    $('.onoffswitch-inner').click(function() {
        var clicks = $(this).data('clicks');
        if (clicks) {
            // odd clicks
            alert('Show profile');
            $('#profile-settings').empty();
        } else {
            // even clicks
            alert('Show settings');
        }
        $(this).data("clicks", !clicks);
    });
    
    
    
});