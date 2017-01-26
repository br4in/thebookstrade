/* global $ */

$(document).ready(function() {
    // Get user data
    $.getJSON('https://thebookstrade-br4in.c9users.io/data', function(data) {
        alert(JSON.stringify(data.user._id));
    });
});