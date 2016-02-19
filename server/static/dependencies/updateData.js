/**
 * Created by AbhishekK on 2/17/2016.
 */


$( "#header-items" ).hide();

setTimeout(function(){

    $.get('/renderContent', function(data) {
        $( "#header-items" ).show();
        console.log(data);
        $( ".loader-div").remove();
        $( "#xmlData").text(data.xmldata)
        $( "#javaData").text(data.javadata)
        $( "#javaFileName").text(data.javaFilename)

        $.get('/generateTestFiles', function(data) {
            console.log(data);
        });

    });

}, 5000);

$( "#launchTest" ).click(function() {
    $.get('/launchTest', function(data) {

        console.log(data);
        socket.emit( 'message', {received: 'received'} );

    });

});

$( "#killTest" ).click(function() {
    $.get('/killTest', function(data) {

        console.log(data);

    });

});