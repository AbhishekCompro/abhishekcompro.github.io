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

    if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1]){
        $('#method-type').val(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].type);
    }
    else{
        $('#method-type').val('');
    };

    if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1]){
        $('#method-group').val(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].group);
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
        }catch(e){

        }
        if(actionNodeArray.length >0){

            for(var i=0;i<actionNodeArray.length;i++){
                console.log('field for: '+actionNodeArray[i].trim());
                console.log('field for: '+actionNodeArray[i].trim().split(' ')[0]);

                $("#actionDetailsForm").append('<div class="col-sm-12" style="margin: 5px 0px 5px 0px">        <input id="'+actionNodeArray[i].trim().split(' ')[1]+'" type="text" class="form-control" id="" placeholder="'+actionNodeArray[i].trim().split(' ')[1]+'">        </div>');
                $('#'+actionNodeArray[i].trim().split(' ')[1]).val(userInputArray[i].actVal);
            }
        }
};



var fillActionDetails = function(){
try{
    if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].init){

        if(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].actions[currentActionNumber-1].init){
            var currentActionNode = taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].actions[currentActionNumber-1];
            $('.functionDisplayName').text(taskDataFilled.items[currentItemNumber-1].methods[currentMethodNumber-1].actions[currentActionNumber-1].syntax);

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
    console.log('reset form')
    updateCurrent(function(){
        if(taskDataFilled){
            fillTaskDetails();
            fillMethodDetails();
            fillActionDetails();
        }
    });
}

$( '.sidebar-menu' ).click(function() {
    refreshForm();
});

updateCurrent(function(){
    refreshForm();
});



// todo: reset form fields if no data exist for that node