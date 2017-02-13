/* global $ */

$(document).ready(function() {
    var url = 'https://thebookstrade-br4in.c9users.io';
    
    $('nav > ul').click(function() {
        window.location.href = url+'/home';
    });
    
    // Get user data
    var user_id;
    $.getJSON(url+'/data', function(data) {
        console.log(JSON.stringify(data));
        user_id = data.user._id;
        var isFirstLogin = data.user.local.firstLogin;
        // if the user il loggin in for the first time, remind it to update
        //      its info in the settings panel
        if (isFirstLogin) {
            alert('Welcome, remember to update your info in the settings panel by clicking on the switch');
        }
        // Set in/out requests counts
        $('#incomingNum').text(data.user.local.requestsIn);
        $('#outgoingNum').text(data.user.local.requestsOut);
        
        // Insert user values into the form, if they exist
        if (data.user.local.city) {
            $('input[name="city"]').val(data.user.local.city);
        }
        if (data.user.local.state) {
            $('input[name="state"]').val(data.user.local.state);
        }
        if (data.user.local.username) {
            $('input[name="username"]').val(data.user.local.username);
            //display username
            $('#title').text('Hello, '+ data.user.local.username);
        }
        
    });
    
    // send values from form to db
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
    
    // prevent empty submission on newBookForm
    $('#newBookForm').submit(function(event) {
        var bookTitle = $('input[name="bookTitle"]').val();
        var postData = {
            title : bookTitle
        };
        if (bookTitle.length > 0) {
            $.post(url+'/newBook', postData);
        } else {
            alert('Title required');
            event.preventDefault();
        }
    });
    
    // Switch button controls
    $('input[name="onoffswitch"]').click(function() {
              // this will contain a reference to the checkbox   
        if (this.checked) {
            // the checkbox is now checked
            $('#profile-settings').hide();
            $('#profile-div').show();
        } else {
            // the checkbox is now no longer checked
            $('#profile-div').hide();
            $('#profile-settings').show();
        }
    });
    
    // Get all user's books
    $.getJSON(url+'/ownedBooks', function(data) {
        console.log(JSON.stringify(data));
        if (data.length != 0) {
            for (var i = 0; i < data.length; i++) {
                var div = `
                <div class="book-div">
                <img id="/removeBook/`+data[i]._id+`" src="`+data[i].cover+`"></div>`;
                $('#my-books').append(div);
            }
        } else {
            var msg = '<p>You have no books to trade</p>';
            $('#my-books').append(msg);
        }
    });
    
    $('#my-books').on('click', 'img', function(event) {
        // remove book
        $.getJSON(url + $(this).attr('id'), function(data) {
            window.location.replace('/profile');
        });
    });
    
    $('#requests-in').click(function() {
        var requestsDiv = `
            
        `;
        $('#requested-books-div').show();
    });
    
    $('#requests-out').click(function() {
        var requestsDiv = `
            
        `;
        $('#requested-books-div').show();
    });
    
    $('.trade-btn').click(function(event) {
        $('#requested-books-div').hide();
        if ($(this).attr('id') === 'reject-btn') {
            // trade has been rejected
        } else {
            // trade has been accepted
        }
    });
    
    
});
