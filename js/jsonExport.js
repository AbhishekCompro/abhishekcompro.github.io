/**
 * Created by AbhishekK on 3/8/2016.
 */


var jsonToFile = function(){

    var taskData =   JSON.parse(localStorage.getItem('taskData'));

    var jsonFilename = taskData.id + '.'+ taskData.scenario + '.json';

    download(new Blob([JSON.stringify(taskData)]), jsonFilename, "text/plain");

};

$( "#downloadTaskJSON" ).on( "click", function() {

    jsonToFile();
});

$('#loadTaskJson').click(function() {
    //get file object
    var file = document.getElementById('files').files[0];
    if (file) {
        // create reader
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            // browser completed reading file - display it
            console.log(e.target.result)
            localStorage.setItem('taskData', (e.target.result));
            window.location.reload(true);
        };
    }
});