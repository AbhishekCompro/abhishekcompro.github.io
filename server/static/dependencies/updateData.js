/**
 * Created by AbhishekK on 2/17/2016.
 */


/*setInterval(function() {
    $.get('/renderContent', function(data) {
        //do something with the data
        //alert('data: ' + data);
        console.log(data);
    });
}, 5000);*/

setTimeout(function(){

    $.get('/renderContent', function(data) {

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

});