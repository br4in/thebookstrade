/* global $ */

$(document).ready(function() {
    var url = 'https://thebookstrade-br4in.c9users.io';
    
    $('nav > ul').click(function() {
        window.location.href = url+'/home';
    });
});