/* global $ */

$(document).ready(function() {
    var url = 'https://thebookstrade-br4in.c9users.io';
    var htmlFile = window.location.pathname;
    var ID = htmlFile.substring(9,htmlFile.length);

    $.getJSON(url + '/bookDetails/' + ID, function(data) {
        console.log(JSON.stringify(data));
        var bookDiv = `
        <h1>`+data.title+`</h1>
        <div class="book-div-details"><img src="`+data.cover+`"></div>
        <div id="book-info-div">
            <div id="author-div">
                <p>Author</p>
                <p class="author">`+data.author+`</p></div>
            <div id="owner-div">
                <p>Owmer</p>
                <p class="owner">`+data.owner+`</p></div>
        </div>
        `;
        $('#book-details-div').append(bookDiv);
    });
    
});