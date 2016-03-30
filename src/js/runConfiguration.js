/**
 * Created by AbhishekK on 2/15/2016.
 */


var renderRunConfiguration = function(){

    $('.method').remove();

    var taskData =   JSON.parse(localStorage.getItem('taskData'));
    console.log('in conf render ' + taskData.items.length)

    var itemsInitCount = 0;
    for(var p=0;p<taskData.items.length;p++){

        if(taskData.items[p].init){
            itemsInitCount++;
        }
        else{
            //console.log($('#run-item-'+ (p+1) ).parent());
            //$('#run-item-'+ (p+1) ).parent().parent('.form-group').hide();
        }
    }

    for(var i=0;i<taskData.items.length;i++){

        if(taskData.items[i].init){

            $( '#run-item-'+ (i+1)  ).prop('checked', true);

            for(var j=0;j<taskData.items[i].methods.length;j++){

                if(taskData.items[i].methods[j].init){

                    if(j==0){
                        $('#item'+(i+1)+'-methods').append('<label style="margin: 5px" class="method">                    <input type="radio" data-method="'+(j+1)+'" name="item'+(i+1)+'-method" class="flat-red" checked>                    Method '+(j+1)+'                    </label>');
                    }else{
                        $('#item'+(i+1)+'-methods').append('<label style="margin: 5px" class="method">                    <input type="radio" data-method="'+(j+1)+'" name="item'+(i+1)+'-method" class="flat-red">                    Method '+(j+1)+'                    </label>');
                    }

                }
            }

        }
        else{

            //$('#run-item-'+ (i+1) ).parent().parent('.form-group').hide();
        }
    }
};



//run task data

var taskData;

var updateSkipItem = function(){

    taskData =   JSON.parse(localStorage.getItem('taskData'));

    for(var i=0;i<taskData.items.length;i++){

        if(taskData.items[i].init){

            var checkboxChecked = $('#run-item-'+(i+1)).prop('checked');
            console.log(i +' : '+ checkboxChecked);
            if(checkboxChecked === false){
                taskData.items[i].skip = true;
            }
            else{
                taskData.items[i].skip = false;
            }
        }
    }

    localStorage.setItem('taskData', JSON.stringify(taskData));
    console.log('***************** taskData '+ JSON.stringify(taskData));
};

var taskRunDataToXMl = function(){
    updateSkipItem();

    taskData =   JSON.parse(localStorage.getItem('taskData'));

    var xmlPre = '<?xml version="1.0" encoding="UTF-8"  standalone="no"?><Task TemplateVersion="V1" id="'+ taskData.id +'" name="'+ taskData.name +'">  <description>'+ taskData.description +'</description>  <friendlyTaskID>'+ taskData.id + '.'+taskData.scenario +'</friendlyTaskID>  <scenario name="'+ taskData.scenario +'">';

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

        // todo - update below loops on basis of user run config selection {handle skip item here}

        if(taskData.items[i].init){

            var jin=0;

            taskDataPre = taskDataPre + '<Item sno="'+(i+1)+'">';

            for(var j=0;j<taskData.items[i].methods.length;j++){

                if(taskData.items[i].methods[j].init){
                    taskDataPre = taskDataPre + '<Method group="'+taskData.items[i].methods[j].group+'" name="'+taskData.items[i].methods[j].type+'" sno="'+(j+1)+'"><Actions>';

                    var methodChecked = $('input[name="item'+(i+1)+'-method"]:checked', '#item'+(i+1)+'-methods').data('method');

                    for(var k=0; k<taskData.items[i].methods[j].actions.length; k++){
                        if(taskData.items[i].methods[j].actions[k].init){

                            if(i>0 && jin==0){
                                if(taskData.items[i-1].skip == true){
                                    if(methodChecked == (j+1)){
                                        jin=1;
                                        taskDataPre = taskDataPre + '<Action sno="'+(k+1)+'"><actionType name="skiptonextitem"></actionType></Action>';
                                    }
                                };
                            }
                            taskDataPre = taskDataPre + '<Action sno="'+(k+jin+1)+'"><actionType name="'+(taskData.items[i].methods[j].actions[k].name).toString().trim().replace("()","")+'">';

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

    var updatedRunXml = xmlPre + taskDataPre + taskDataPost + xmlPost;

    localStorage.setItem('updatedRunXml', JSON.stringify(updatedRunXml));
    //console.log(updatedRunXml);

    return updatedRunXml;

};


var prettyRunJava = function(){
    // todo - update below loops on basis of user run config selection {handle item & method to run here}
    var prettyJavaFileContent = '';


    return prettyJavaFileContent;
};

var getRunTaskDataFromLsm = function(){
    return taskRunDataToXMl();
};


$( "#previewXml" ).on( "click", function() {

});

var updateRunXml = function(){

    var sampleRunXML = getRunTaskDataFromLsm();
    var prettyRunXML;

    prettyRunXML = vkbeautify.xml(sampleRunXML);
    console.log(prettyRunXML);
    localStorage.setItem('updatedRunXml', JSON.stringify(prettyRunXML));
    return prettyRunXML;
};

var updateRunJava = function(){

    var updatedRunJava = prettyRunJava();

    console.log(updatedRunJava);
    localStorage.setItem('updatedRunJava', JSON.stringify(updatedRunJava));
    return updatedRunJava;
};

var getdistXML = function(){

    var sampleXML = getTaskDataFromLsm();
    var distXml;
    distXml = vkbeautify.xml(sampleXML);
    console.log(distXml);

    return distXml;
};


var getRunJava = function(){

    var taskData =   JSON.parse(localStorage.getItem('taskData'));
    console.log('in conf render ' + taskData.items.length);

    var itemsInitCount = 0;
    for(var p=0;p<taskData.items.length;p++){

        if(taskData.items[p].init){
            itemsInitCount++;
        }
        else{
            //console.log($('#run-item-'+ (p+1) ).parent());
            //$('#run-item-'+ (p+1) ).parent().parent('.form-group').hide();
        }
    }
    // todo - update to current app name
    var preJ = 'package sims.testcase.' +
        taskData.appName +
        ';    import org.testng.annotations.Test;    import sims.testcase.SimsBase;    public class Test_' +
        ((taskData.id).replace(/\./gi, "_")).trim()

        +
        '_' +
        taskData.scenario.toUpperCase().trim()
        +
        ' extends SimsBase {    ';

    var postJout = ' }';


    // todo: create runj from taskdata lsm
    var runJ = '';
    var testCount = 0;

    var preJin = '' +
            '@Test (groups = {' +
            '"Acceptance", "Primary"' + //todo: change this
            '})        public void ' +
            ((taskData.id).replace(/\./gi, "_")).trim()
            +
            '_' +
            (taskData.scenario.toUpperCase()).trim() + (++testCount).toString()
            +
            '() throws Exception {            System.out.println("START..");            ';

        var postJ = 'Thread.sleep(3000);            ' +
            'System.out.println("DONE.");        }   ';

        for(var i=0;i<taskData.items.length;i++){

            if(taskData.items[i].init){

                if($('#run-item-'+(i+1)).is(':checked') == true){

                    var methodChecked = $('input[name="item'+(i+1)+'-method"]:checked', '#item'+(i+1)+'-methods').data('method');

                    runJ = runJ + 'getAndPerformTask(' +
                    '"' +
                    taskData.id.trim() + '.' + taskData.scenario.trim() +
                    '", ' +
                    '"' +
                    taskData.scenario.trim() +
                    '", ' +
                    '"' +
                    (i+1).toString() +
                    '", ' +
                    '"' +
                    (methodChecked).toString() +
                    '"' +
                    ');            ';
                    //break;

                }

            }
            else{

            }
        }

     ;

    var res = js_beautify((preJ + preJin + runJ + postJ + postJout));
    return res;
};


var getPathwayJava = function(){

    var taskData =   JSON.parse(localStorage.getItem('taskData'));
    console.log('in conf render ' + taskData.items.length);

    var itemsInitCount = 0;
    for(var p=0;p<taskData.items.length;p++){

        if(taskData.items[p].init){
            itemsInitCount++;
        }
        else{
            //console.log($('#run-item-'+ (p+1) ).parent());
            //$('#run-item-'+ (p+1) ).parent().parent('.form-group').hide();
        }
    }
    // todo - update to current app name
    var preJ = 'package sims.testcase.' +
        taskData.appName +
        ';    import org.testng.annotations.Test;    import sims.testcase.SimsBase;    public class Test_' +
        ((taskData.id).replace(/\./gi, "_")).trim()

        +
        '_' +
        taskData.scenario.toUpperCase().trim()
        +
        ' extends SimsBase {    ';

    var postJout = ' }';



    // start iterate
    var pathwayListData

    if(localStorage.getItem('pathwayListData')){
        pathwayListData = JSON.parse(localStorage.getItem('pathwayListData'));
    }

    var runJFinal = preJ;

    var testCount = 0;
if(pathwayListData !== undefined){
    pathwayListData.forEach( function (arrayItem)
    {

        // todo: create runj from taskdata lsm
        var runJ = '';

        var preJin = '\n    ' +
            '@Test (groups = {' +
            '"Acceptance", "Primary"' + //todo: change this
            '})        public void ' +
            ((taskData.id).replace(/\./gi, "_")).trim()
            +
            '_' +
            (taskData.scenario.toUpperCase()).trim() + '_' + (++testCount).toString()
            +
            '() throws Exception {            System.out.println("START..");            ';

        var postJ = 'Thread.sleep(3000);            ' +
            'System.out.println("DONE.");        }   \n';

        arrayItem.forEach( function (arrayItem2)
        {

            runJ = runJ + 'getAndPerformTask(' +
            '"' +
            taskData.id.trim() + '.' + taskData.scenario.trim() +
            '", ' +
            '"' +
            taskData.scenario.trim() +
            '", ' +
            arrayItem2.toString()
            +
            ');            ';

        });

        runJFinal = runJFinal + js_beautify((preJin + runJ + postJ ));

    });
}
    runJFinal = runJFinal + postJout;

    console.log(js_beautify(runJFinal));
    return js_beautify(runJFinal);
};

$("#runTaskOnServer").click(function(){

console.log('inside runTaskOnServer')
    var prettyRunXML = updateRunXml();

    //console.log('prettyRunXML');
    //console.log(prettyRunXML);
    var prettyRunJava = getRunJava();  //todo: change this

    var distXML = '';
    var distJava = '';

    var taskData =   JSON.parse(localStorage.getItem('taskData'));

    var javaFilename =    'Test_.java';
    var xmlFilename =    '_.xml';

try{
     javaFilename =    'Test_' +   (taskData.id +'_'+ taskData.scenario).replace(/\./gi, "_") + '.java';
     xmlFilename =    (taskData.id +'_'+ taskData.scenario).replace(/\./gi, "_") + '.xml';
}catch(er){

}

    console.log('prettyRunJava: ' + prettyRunJava);

    window.open ("http://localhost:80/testrun",",","menubar=1,resizable=1,width=1200,height=800");

    setTimeout(function(){
        $.post("http://localhost:80/testrun",{xmlFilename: xmlFilename, xmldata: prettyRunXML, javaFilename: javaFilename, javadata: prettyRunJava, distXML: distXML, distJava: distJava, appName: taskData.appName}, function(data){
            if(data==='done')
            {
                console.log("post success");
            }
        });
    }, 2000);
});

$( "#run-conf-sidebar" ).click(function() {


    var currentMargin = $(".content").css('margin-right');

    if(currentMargin != '280px')
    {
        $(".content").css({'margin-right': '280px'});

    }
    else{
        console.log('inside else');
        $(".content").css({'margin-right': '0px'});
    }

    renderRunConfiguration();
});

var pathwayListData = [];

var addToPathway = function(){

    if(localStorage.getItem('pathwayListData')){

            pathwayListData = JSON.parse(localStorage.getItem('pathwayListData'));
        }

    var pathwayListItem = '';
    var currentPathway = [];

    for(var i=0;i<taskData.items.length;i++){

        if(taskData.items[i].init){

            //if($('#run-item-'+(i+1)).is(':checked') == true){

                var methodChecked = $('input[name="item'+(i+1)+'-method"]:checked', '#item'+(i+1)+'-methods').data('method');


                currentPathway.push('"'+(i+1)+'", "'+methodChecked+'"') ;
                pathwayListItem = pathwayListItem + ' M-' + methodChecked;

        }
        else{

        }
    }

    console.log(pathwayListData);

    pathwayListData.push(currentPathway);

    localStorage.setItem('pathwayListData', JSON.stringify(pathwayListData));

    $('#pathwayList').append('<li><div class=" bg-green" style="position: relative; z-index: auto; left: 0px; top: 0px; padding: 5px; margin: 2px">'+pathwayListItem+' <a href="#" class="deletePathway"><span class="label button pull-right bg-red delete-method-node"><i class="fa fa-times"></i></span></a></div></li>');
};

$( "#addToPathwayList" ).click(function() {
    addToPathway();
});

$('#pathwayList').on('click', '.deletePathway', function(e) {
    var pathwayListData =   JSON.parse(localStorage.getItem('pathwayListData'));

    var el = $(this);
    console.log('el.parent().index() '+el.parent().parent().index());

    el.parent().parent().remove();
    pathwayListData.splice((el.parent().parent().index() + 1), 1);

    localStorage.setItem('pathwayListData', JSON.stringify(pathwayListData));
    e.stopPropagation();
});

$("#exportFinalTop").click(function(){

    console.log('inside exportFinalTop')
    var prettyRunXML = updateRunXml();

    //console.log('prettyRunXML');
    //console.log(prettyRunXML);
    var prettyRunJava = getRunJava();

    var distXML = getdistXML();
    var distJava = getPathwayJava();

    var taskData =   JSON.parse(localStorage.getItem('taskData'));

    var javaFilename =    'Test_.java';
    var xmlFilename =    '_.xml';

    try{
        javaFilename =    'Test_' +   (taskData.id +'_'+ taskData.scenario).replace(/\./gi, "_") + '.java';
        xmlFilename =    (taskData.id +'_'+ taskData.scenario).replace(/\./gi, "_") + '.xml';
    }catch(er){

    }

    //console.log('prettyRunJava: ' + distJava);

    window.open ("http://localhost:80/commit",",","menubar=1,resizable=1,width=1200,height=800");

    setTimeout(function(){
        $.post("http://localhost:80/commit",{xmlFilename:xmlFilename,xmldata: prettyRunXML,javaFilename:javaFilename,javadata: prettyRunJava, distXML: distXML, distJava:distJava, appName: taskData.appName}, function(data){
            if(data==='done')
            {
                console.log("post success");
            }
        });
    }, 2000);
});



