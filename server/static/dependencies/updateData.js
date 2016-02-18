/**
 * Created by AbhishekK on 2/17/2016.
 */


setInterval(function() {
    $.get('/renderContent', function(data) {
        //do something with the data
        //alert('data: ' + data);
        console.log('data: ' + data);
    });
}, 5000);