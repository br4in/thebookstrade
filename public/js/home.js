/* global $ */

$(document).ready(function() {
    var url = 'https://thebookstrade-br4in.c9users.io';
    
    $('nav > ul').click(function() {
        window.location.href = url+'/home';
    });
    
    // Get all the books in db
    $.getJSON(url + '/getAll', function(data) {
        for (var i = 0; i < data.length; i++) {
            var div = `
            <a href="/details/`+data[i]._id+`"><div class="book-div">
            <img src="`+data[i].cover+`"></div></a>`;
            $('#all-books-div').append(div);
        }
    });
});
