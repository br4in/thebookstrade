/* global $ */

$(document).ready(function() {
    var url = 'https://thebookstrade-br4in.c9users.io';
    var requestsInArray = [];
    var requestsOutArray = [];
    
    $('nav > ul').click(function() {
        window.location.href = url+'/home';
    });
    
    // Get user data
    var user_id;
    $.getJSON(url+'/data', function(data) {
        user_id = data.user._id;
        var isFirstLogin = data.user.local.firstLogin;
        // if the user il logging in for the first time, remind it to update
        //      its info in the settings panel
        if (isFirstLogin) {
            alert('Welcome, remember to update your info in the settings panel by clicking on the switch');
        }
        // Set in/out requests counts
        $('#incomingNum').text(data.user.local.requestsIn);
        $('#outgoingNum').text(data.user.local.requestsOut);
        // Fill requestsIn
        requestsInArray = data.user.local.requestsInArray;
        requestsOutArray = data.user.local.requestsOutArray;
        
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
            window.location.href = "/profile";
        });
    });
    
    $('#changePasswdForm').submit(function(event) {
        event.preventDefault();
        var values = {};
        $.each($('#changePasswdForm').serializeArray(), function(i, field) {
            values[field.name] = field.value;
        });
        $.post(url+'/changePasswd', values, function(data) {
            window.location.href = '/profile';
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
                <button id="/removeBook/`+data[i]._id+`" class="close-btns"></button>
                <img src="`+data[i].cover+`">
                </div>`;
                $('#my-books').append(div);
            }
        } else {
            var msg = '<p>You have no books to trade</p>';
            $('#my-books').append(msg);
        }
    });
    
    $('#my-books').on('click', 'button', function(event) {
        // remove book
        $.getJSON(url + $(this).attr('id'), function(data) {
            window.location.href = '/profile';
        });
    });
    
    $('#requests-in').click(function() {
        $('#bookTitles').empty();
        $('#requested-books-div').show();
        var btnsDiv = `
            <button class="trade-btn" id="reject-btn">X</button>
            <button class="trade-btn" id="accept-btn">&#10003;</button>
        `;
        if (requestsInArray.length > 0) {
            for (var i = 0; i < requestsInArray.length; i++) {
                var bookTitle = `
                <p id=`+requestsInArray[i][2]+`>`
                +requestsInArray[i][0]+` : `
                +requestsInArray[i][1]+`</p>`;
                var completeDiv = '<div>'+bookTitle+btnsDiv+'</div>';
                $('#bookTitles').append(completeDiv);
            }
        } else {
            var message = '<p>You have no incoming trade requests</p>';
            $('#bookTitles').append(message);
        }
        
    });
    
    $('#requests-out').click(function() {
        $('#bookTitles').empty();
        $('#requested-books-div').show();
        var booktitle;
        if (requestsOutArray.length > 0) {
            for  (var i = 0; i < requestsOutArray.length; i++) {
                if (requestsOutArray[i].length === 2) {
                booktitle = `
                <p>`+requestsOutArray[i][0]+` : `+requestsOutArray[i][1]+`</p>`;
                } else {
                    booktitle = `
                    <p>`+requestsOutArray[i][0]+
                    ` - `+requestsOutArray[i][1]+
                    ` : `+requestsOutArray[i][2]+`</p>`;
                }
                $('#bookTitles').append(booktitle);
            }
        } else {
            var message = '<p>You have no outgoing trade requests</p>';
            $('#bookTitles').append(message);
        }
    });
    
    $('#requested-books-div').on('click', '.trade-btn', function(event) {
        // get the clicked title
        var ID = $(this).siblings('p').attr('id');
        var text = $(this).siblings('p').text();
        var delimiter = text.lastIndexOf(':');
        var title = text.substr(0, delimiter - 1);
        var requester = text.substr(delimiter + 2);
        
        // remove the clicked book title
        if ($('#requested-books-div').length === 1) {
            $('#requested-books-div').hide();
        } else {
            var parent = $(this).parent();
            parent.remove();
        }
    
        // determine the status of the trade and send result
        var data = {
            title : title,
            requester : requester,
            ID : ID
        };
        if ($(this).attr('id') === 'reject-btn') {
            // trade has been rejected
            data.status = 'Rejected';
        } else {
            // trade has been accepted
            data.status = 'Accepted';
        }
        $.post(url+ '/tradeStatus', data, function(data) {
            window.location.href = '/profile';
        });
    });
    
    // hide #requested-books-div on btn click
    $('.close-btns').click(function() {
        $('#requested-books-div').hide();
        $('#bookTitles').empty();
    });

});
