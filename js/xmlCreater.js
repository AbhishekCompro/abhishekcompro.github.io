/**
 * Created by AbhishekK on 2/10/2016.
 */
var taskData;

var taskDataToXMl = function(){

    taskData =   JSON.parse(localStorage.getItem('taskData'));

    var xmlPre = '<?xml version="1.0" encoding="UTF-8"?><Task id="'+ taskData.id +'" name="'+ taskData.name +'">  <description>'+ taskData.description +'</description>  <friendlyTaskID>'+ taskData.id +'.'+ taskData.scenario +'</friendlyTaskID>  <scenario name="'+ taskData.scenario +'">';

    var xmlPost =   '</scenario>    </Task>';


    var itemsInitCount = 0;
    for(var p=0;p<taskData.items.length;p++){

        if(taskData.items[p].init){
            itemsInitCount++;
        }
    }

    var taskDataPre = '<Items count="'+itemsInitCount+'">';
    var taskDataPost = '</Items>';

    for(var i=0;i<taskData.items.length;i++){


        if(taskData.items[i].init){

            taskDataPre = taskDataPre + '<Item sno="'+(i+1)+'">';

            for(var j=0;j<taskData.items[i].methods.length;j++){

                if(taskData.items[i].methods[j].init){
                    taskDataPre = taskDataPre + '<Method group="'+taskData.items[i].methods[j].group+'" name="'+taskData.items[i].methods[j].group+'" sno="'+(j+1)+'"><Actions>';

                    for(var k=0;k<taskData.items[i].methods[j].actions.length;k++){

                        if(taskData.items[i].methods[j].actions[k].init){
                            taskDataPre = taskDataPre + '<Action sno="'+(k+1)+'"><actionType name="'+(taskData.items[i].methods[j].actions[k].name).toString().trim().replace("()","")+'">';

                             for(var l=0;l<taskData.items[i].methods[j].actions[k].values.length;l++){
                                 taskDataPre = taskDataPre + '<'+taskData.items[i].methods[j].actions[k].values[l].actKey+'>'+taskData.items[i].methods[j].actions[k].values[l].actVal+'</'+taskData.items[i].methods[j].actions[k].values[l].actKey+'>';
                             }

                            taskDataPre = taskDataPre + '</actionType></Action>';
                        }
                    }
                    taskDataPre = taskDataPre + '</Actions></Method>';
                }
            }
            taskDataPre = taskDataPre + '</Item>';
        }
    }

    var finalXmlString = xmlPre + taskDataPre + taskDataPost + xmlPost;

    localStorage.setItem('finalXmlString', JSON.stringify(finalXmlString));
    console.log(finalXmlString);

    return finalXmlString;

};


var getTaskDataFromLsm = function(){
    return taskDataToXMl();
};



$( "#previewXml" ).on( "click", function() {
    var sampleXML = getTaskDataFromLsm();
    var prettyXML;

    prettyXML = vkbeautify.xml(sampleXML);
    console.log(prettyXML);
    $('#prettyXmlModalBody').text(prettyXML);
});

$( "#downloadFromPreviewXML" ).on( "click", function() {

    var sampleXML = getTaskDataFromLsm();
    var prettyXML;

    prettyXML = vkbeautify.xml(sampleXML);

    var xmlFilename = (taskData.id +'_'+ taskData.scenario).replace(/\./gi, "_");

    download(new Blob([prettyXML]), xmlFilename+".xml", "text/plain");
});


$( "#exportXMLTop" ).click(function() {
    taskData =   localStorage.getItem('taskData');
    console.log('console.log(taskData.name) ' + taskData);

    var sampleXML = getTaskDataFromLsm();
    var prettyXML;

    prettyXML = vkbeautify.xml(sampleXML);

    var xmlFilename = (taskData.id +'_'+ taskData.scenario).replace(/\./gi, "_");

    //download(new Blob([prettyXML]), xmlFilename+".xml", "text/plain");

    getPathwayJava();
    //todo: create and export full java and xml acc to pathway & call server with params for commit to svn & download files.

});