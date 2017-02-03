/* global $ */

$(document).ready(function() {
    // Get all the books in db
    $.getJSON('https://thebookstrade-br4in.c9users.io/getAll', function(data) {
        for (var i = 0; i < data.length; i++) {
            var div = `
            <div class="book-div"><a href="/test">
            <img class="book-img" src="`+data[i].cover+`">
            </a></div>
            `;
            $('#all-books-div').append(div);
        } 
    });
});