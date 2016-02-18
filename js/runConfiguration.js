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
                        $('#item'+(i+1)+'-methods').append('<label class="method">                    <input type="radio" data-method="'+(j+1)+'" name="item'+(i+1)+'-method" class="flat-red" checked>                    Method '+(j+1)+'                    </label>');
                    }else{
                        $('#item'+(i+1)+'-methods').append('<label class="method">                    <input type="radio" data-method="'+(j+1)+'" name="item'+(i+1)+'-method" class="flat-red">                    Method '+(j+1)+'                    </label>');
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
        }
    }

    localStorage.setItem('taskData', JSON.stringify(taskData));
    console.log('***************** taskData '+ JSON.stringify(taskData));
};

var taskRunDataToXMl = function(){
    updateSkipItem();

    taskData =   JSON.parse(localStorage.getItem('taskData'));

    var xmlPre = '<?xml version="1.0" encoding="UTF-8"?><Task id="'+ taskData.id +'" name="'+ taskData.name +'">  <description>'+ taskData.description +'</description>  <friendlyTaskID>'+ taskData.id + taskData.scenario +'</friendlyTaskID>  <scenario name="'+ taskData.scenario +'">';

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

            taskDataPre = taskDataPre + '<Item sno="'+(i+1)+'">';

            for(var j=0;j<taskData.items[i].methods.length;j++){

                if(taskData.items[i].methods[j].init){
                    taskDataPre = taskDataPre + '<Method group="'+taskData.items[i].methods[j].group+'" name="'+taskData.items[i].methods[j].group+'" sno="'+(j+1)+'"><Actions>';

                    for(var k=0;k<taskData.items[i].methods[j].actions.length;k++){

                        if(taskData.items[i].methods[j].actions[k].init){
                            var jin=0;
                            if(i>0){
                                if(taskData.items[i-1].skip == true){
                                        jin=1;
                                        taskDataPre = taskDataPre + '<Action sno="'+(k+1)+'"><actionType name="skipItem"></actionType></Action>';
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


var getdistJava = function(){

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
        'access' +
        ';    import org.testng.annotations.Test;    import sims.testcase.SimsBase;    public class Test_' +
        (taskData.id.replace(new RegExp('.', 'g'), '_')).trim()
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
            (taskData.id.replace(new RegExp('.', 'g'), '_')).trim()
            +
            '_' +
            (taskData.scenario.toUpperCase()).trim() + (++testCount).toString()
            +
            '() throws Exception {            System.out.println("START..");            ';

        var postJ = 'Thread.sleep(3000);            ' +
            'System.out.println("DONE.");        }   ';

        for(var i=0;i<taskData.items.length;i++){

            if(taskData.items[i].init){

                        var methodChecked = $('input[name="item'+(i+1)+'-method"]:checked', '#item'+(i+1)+'-methods').data('method');

                        runJ = runJ + 'getAndPerformTask(' +
                            '"' +
                            taskData.id.trim() +
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
                        break;
            }
            else{

            }
        }

     ;

    var res = js_beautify((preJ + preJin + runJ + postJ + postJout))
    return res;
};

$("#runTaskOnServer").click(function(){
    var prettyRunXML = updateRunXml();
    var prettyRunJava = getdistJava();  //todo: change this

    var distXML = getdistXML();
    var distJava = getdistJava();

    console.log('prettyRunJava: ' + prettyRunJava);

    window.open ("http://localhost:3000/testrun",",","menubar=1,resizable=1,width=1024,height=800");

    setTimeout(function(){
        $.post("http://localhost:3000/testrun",{xmlFilename:'',xmldata: prettyRunXML,javaFilename:'',javadata: prettyRunJava, distXML: distXML, distJava:distJava}, function(data){
            if(data==='done')
            {
                console.log("post success");
            }
        });
    }, 2000);
});

$( "#run-conf-sidebar" ).click(function() {
    renderRunConfiguration();
});

