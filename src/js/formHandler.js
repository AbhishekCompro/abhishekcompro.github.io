/**
 * Created by AbhishekK on 2/3/2016.
 */

var currentScenario = 'T1';
var currentItemNumber = 1;
var currentMethodNumber = 1;
var currentActionNumber = 1;
var taskDataFilled = {};

updateCurrent = function(callback){
    // get and update from breadcrum
    var currentScenarioLSM =   localStorage.getItem('currentScenario');
    if(currentScenarioLSM){currentScenario = currentScenarioLSM};

    var currentItemNumberLSM = JSON.parse(localStorage.getItem('currentItemNumber'));
    if(currentItemNumberLSM){currentItemNumber = parseInt(currentItemNumberLSM)};

    var currentMethodNumberLSM = JSON.parse(localStorage.getItem('currentMethodNumber'));
    if(currentMethodNumberLSM){currentMethodNumber = parseInt(currentMethodNumberLSM)};

    var currentActionNumberLSM = JSON.parse(localStorage.getItem('currentActionNumber'));
    if(currentActionNumberLSM){currentActionNumber = parseInt(currentActionNumberLSM)};

    taskDataFilled =   JSON.parse(localStorage.getItem('taskData'));

    callback();
};



var fillTaskDetails = function(){

    if(taskDataFilled.name){
        $('#inputTaskName').val(taskDataFilled.name)
    }
    else{
        $('inputTaskName').val('');
    };

    if(taskDataFilled.id){
        $('#inputTaskId').val(taskDataFilled.id);
    }
    else{
        $('inputTaskId').val('');
    };

    if(taskDataFilled.description){
        $('#taskDescription').val(taskDataFilled.description);
    }
    else{
        $('taskDescription').val('');
    };

};

var fillMethodDetails = function(){
    console.log('inside fill method details')

    if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1]){
        var techGroups = document.getElementById("method-type");
        $('select#method-type option').removeAttr("selected");

        var selectedGroups = taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].type.split(',');

        console.log('selectedGroups.length '+selectedGroups.length);
        console.log(selectedGroups)

        for (var i = 0; i < techGroups.options.length; i++) {
            for (var j = 0; j < selectedGroups.length; j++) {
                if (techGroups.options[i].value == selectedGroups[j]) {
                    techGroups.options[i].selected = true;
                }
            }
        }
    }
    else{
        $('#method-type').val('');
    };

    if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1]){
        var techGroups = document.getElementById("method-group");

        $('select#method-group option').removeAttr("selected");

        var selectedGroups = taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].group.split(',');

        for (var i = 0; i < techGroups.options.length; i++) {
            for (var j = 0; j < selectedGroups.length; j++) {
                if (techGroups.options[i].value == selectedGroups[j]) {
                    techGroups.options[i].selected = true;
                }
            }
        }
    }
    else{
        $('#method-group').val('');
    };
};

var updateDetailsForm = function(functionSyntax, userInputArray){

        $("#actionDetailsForm").empty();
        var el = $(this);

        var clickedNodeText = functionSyntax;

            //el.parent().parent().text();
/*        $(".functionDisplayName").text(clickedNodeText.trim());

        var actionNodeFunction =  clickedNodeText.trim().replace(/ *\([^)]*\) *//*g, "");
        $(".functionDisplayName").attr('name', actionNodeFunction + '()');*/

        var actionNodeArray ;

        try{
            actionNodeArray = (clickedNodeText.match(/\(([^)]+)\)/)[1]).split(',');
            if(actionNodeArray.length >0){

                for(var i=0;i<actionNodeArray.length;i++){
                    console.log('field for: '+actionNodeArray[i].trim());
                    console.log('field for: '+actionNodeArray[i].trim().split(' ')[0]);

                    $("#actionDetailsForm").append('<div class="col-sm-12" style="margin: 5px 0px 5px 0px">        <input id="'+actionNodeArray[i].trim().split(' ')[1]+'" type="text" class="form-control" id="" placeholder="'+actionNodeArray[i].trim().split(' ')[1]+'">        </div>');
                    $('#'+actionNodeArray[i].trim().split(' ')[1]).val(userInputArray[i].actVal);
                }
            }
        }catch(e){

        }
    $('#saveActionButton').show();
};



var fillActionDetails = function(){
try{
    if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].init){

        if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].actions[currentActionNumber-1].init){
            var currentActionNode = taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].actions[currentActionNumber-1];
            $('.functionDisplayName').text(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].actions[currentActionNumber-1].syntax);

            var actionNodeFunction =  (taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].actions[currentActionNumber-1].syntax).trim().replace(/ *\([^)]*\) */g, "");
            $(".functionDisplayName").attr('name', actionNodeFunction + '()');

            updateDetailsForm( currentActionNode.syntax , currentActionNode.values );
        }
        else{
            $('.functionDisplayName').text('');
            $("#actionDetailsForm").empty();
        };

    }

}catch(err){
    $('.functionDisplayName').text('');
    $("#actionDetailsForm").empty();
}

};


var refreshForm = function(){
    $('#saveActionButton').hide();
    updateCurrent(function(){
        if(taskDataFilled){
            fillTaskDetails();
            fillMethodDetails();
            fillActionDetails();
        }
    });
};

$( '.sidebar-menu' ).click(function() {
    refreshForm();
});

updateCurrent(function(){
    refreshForm();
});


var renderCurrentActionList = function(){

    var currentActionList = [];

    console.log('currentItemNumber: ' +currentItemNumber);
    console.log('currentMethodNumber: '+currentMethodNumber);


    $("#layout-skins-list1 tbody").empty();

    var taskData =   JSON.parse(localStorage.getItem('taskData'));

    if(taskData.items[currentItemNumber - 1].init){

        if(taskData.items[currentItemNumber - 1].methods[currentMethodNumber-1]) {
            if (taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].init) {

                for (var k = 0; k < taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions.length; k++) {

                    if (taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[k]) {

                        if (taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[k].init) {

                            var functionName = taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[k].name.replace(')', '');

                            for (var l = 0; l < taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[k].values.length; l++) {

                                functionName = functionName + taskData.items[currentItemNumber - 1].methods[currentMethodNumber - 1].actions[k].values[l].actVal + ' , ';
                            }

                            functionName = functionName.replace(/,([^,]*)$/, '' + '$1');
                            functionName = functionName + ')';

                            currentActionList.push(functionName);
                        }
                    }
                }
            }
        }
    }

        for(var i=0;i<currentActionList.length;i++){

            $("#layout-skins-list1 tbody").append('                <tr class="action-details-button">                  <td><code>'+currentActionList[i]+'</code></td></tr>')
        }
};

$('.action-details-section').hide();
$('.method-details-section').hide();

$('.sidebar-menu').on('click', '.method-node', function(e) {

    $('.action-details-section').hide();
    $('.method-details-section').show();

    renderCurrentActionList();

});

$('.sidebar-menu').on('click', '.add-method a', function(e) {

    $('.action-details-section').hide();
    $('.method-details-section').show();

    renderCurrentActionList();

});


$('.sidebar-menu').on('click', '.action-node', function(e) {

    $('.method-details-section').hide();
    $('.action-details-section').show();

    renderCurrentActionList();

});

$('.item-node a').click(function(e) {

    if (e.target !== this)
        return;

    $('.method-details-section').hide();
    $('.action-details-section').hide();

    renderCurrentActionList();
});

$('#saveActionButton').click(function(e){
    renderCurrentActionList();
});


/*
$('.reorder-up, .reorder-down').click(function(e){
    updateDetailsForm();
    renderCurrentActionList();
});
*/
