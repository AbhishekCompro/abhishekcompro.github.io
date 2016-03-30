/**
 * Created by AbhishekK on 3/8/2016.
 */


var jsonToFile = function(){

    var taskData =   JSON.parse(localStorage.getItem('taskData'));
    var pathwayListData = [];

    if(localStorage.getItem('pathwayListData')){
        pathwayListData = JSON.parse(localStorage.getItem('pathwayListData'));

    }

    var jsonFilename = taskData.id + '.'+ taskData.scenario + '.json';

    var jsonFileContent = '[' + JSON.stringify(taskData) +',' + JSON.stringify(pathwayListData) + ']';

    download(new Blob([jsonFileContent]), jsonFilename, "text/plain");

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
            //console.log(JSON.parse(e.target.result)[0]);
            var data1 = JSON.parse(e.target.result);
            if(Array.isArray(data1)){
                localStorage.setItem('taskData', (JSON.stringify(JSON.parse(e.target.result)[0])));
                localStorage.setItem('pathwayListData', (JSON.stringify(JSON.parse(e.target.result)[1])));
                window.location.reload(true);
            }else{
                localStorage.setItem('taskData', (JSON.stringify(JSON.parse(e.target.result))));
                window.location.reload(true);
            }

        };
    }
});