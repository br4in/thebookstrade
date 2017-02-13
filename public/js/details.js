/* global $ */

$(document).ready(function() {
    var url = 'https://thebookstrade-br4in.c9users.io';
    var htmlFile = window.location.pathname;
    var ID = htmlFile.substring(9,htmlFile.length);
    var bookOwner;
    
    // Get book's info then create and append div
    $.getJSON(url + '/bookDetails/' + ID, function(data) {
        bookOwner = data.owner;
        var bookDiv = `
        <h1>`+data.title+`</h1>
        <div id="container">
            <div class="book-div-details"><img src="`+data.cover+`"></div>
            <div id="book-info-div">
                <div id="author-div">
                    <p>Author: `+data.author+`</p></div>
                <div id="owner-div">
                    <p>Owner : `+data.owner+`</p></div>
                <button class="inputSubmit" id="request-btn">Request book</button>
            </div>
        </div>
        `;
        $('#book-details-div').append(bookDiv);
    });
    
    // On request button press, send request to the owner and set available
    //      to false. (if the trade won't be successful, set back to true)
    $('#book-details-div').on('click', 'button', function() {
        var options = {
            owner : bookOwner,
            ID : ID
        };
        $.post(url + '/trade', options, function() {
            
        });
    });
});