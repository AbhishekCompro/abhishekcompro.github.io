/**
 * Created by AbhishekK on 3/23/2016.
 */


// Put the object into storage
//  localStorage.setItem('taskData', JSON.stringify(taskData));

// Retrieve the object from storage
//  var taskData = localStorage.getItem('taskData');


var swapArrayElement = function(list,x,y){
    var b = list[y];
    list[y] = list[x];
    list[x] = b;

    return list;
};

$('.sidebar-menu').on('click', '.reorder-up', function() {
    var taskData =   JSON.parse(localStorage.getItem('taskData'));
    // todo - update lsm for all & current node data on reorder  + update breadcrum & current node
    var $current = $('.action-node.active')
    var $previous = $current.prev('li');

    /*    var _a = $current.html();
     var _b = $previous.html();*/
    /*    console.log('$current ' + ($current.index() + 1));
     console.log('$next ' + ($previous.index() + 1));*/

    var currentIndex = ($current.index());
    var nextIndex = ($previous.index()+2);

    if($previous.length !== 0){
        /*      $current.find('a').html('<i class="fa fa-circle-o"></i>Action ' + currentIndex);
         $previous.find('a').html('<i class="fa fa-circle-o"></i>Action ' + nextIndex);*/

//      remove / add delete node
        if($current.next('li').next('li').length == 0){
            $current.find('.delete-action-node').remove();

            if($current.prev('li').index() > 0){
                $current.prev('li').find('a').append('<span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span>');
            }
        }

//      update data
        var currentAddActionData = $current.data('tree');

        var updatedAddActionData = {"item":currentAddActionData.item,"method":currentAddActionData.method,"action":(parseInt(currentAddActionData.action) - 1)};

        var previousAddActionData = $previous.data('tree');
        var updatedPrevAddActionData = {"item":previousAddActionData.item,"method":previousAddActionData.method,"action":(parseInt(previousAddActionData.action) + 1)};

        $current.attr('data-tree',JSON.stringify(updatedAddActionData));
        $previous.attr('data-tree',JSON.stringify(updatedPrevAddActionData));

//      update view
        $current.insertBefore($previous);

        var a = $.extend(true, {}, updatedAddActionData);
        a.item = parseInt(a.item);
        a.method = parseInt(a.method);
        a.action = currentIndex;
        updateBreadcrum(a);

//      swap data & save

        var updatedActions = swapArrayElement(taskData.items[(a.item - 1)].methods[(a.method - 1)].actions,(currentIndex-1),currentIndex);
        taskData.items[(a.item-1)].methods[(a.method-1)].actions = updatedActions;

        localStorage.setItem('taskData', JSON.stringify(taskData));

        renderCurrentActionList();
        refreshForm();
    }
    else{

        renderCurrentActionList();
        refreshForm();
    }
    return false;
});

/*  $(".reorder-down").click(function(){

 });*/

$('.sidebar-menu').on('click', '.reorder-down', function() {
    var taskData =   JSON.parse(localStorage.getItem('taskData'));
    // todo - update lsm for all & current node data on reorder + update breadcrum & current node
    var $current = $('.action-node.active')
    var $next = $current.next('li');

    var currentIndex = ($current.index() + 2);
    var nextIndex = ($next.index());

    if($next.next('li').length !== 0){

//      remove / add delete node
        if($next.next('li').next('li').length == 0){
            $next.find('.delete-action-node').remove();

            if($current.index() > 0){
                $current.find('a').append('<span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span>');
            }

        }

        var currentAddActionData = $current.data('tree');
        var updatedAddActionData = {"item":currentAddActionData.item,"method":currentAddActionData.method,"action":(parseInt(currentAddActionData.action) + 1)};

        var previousAddActionData = $next.data('tree');
        var updatedPrevAddActionData = {"item":previousAddActionData.item,"method":previousAddActionData.method,"action":(parseInt(previousAddActionData.action) - 1)};

        $current.attr('data-tree', JSON.stringify(updatedAddActionData));
        $next.attr('data-tree', JSON.stringify(updatedPrevAddActionData));

//      update view
        $current.insertAfter($next);

        var a = $.extend(true, {}, updatedAddActionData);
        a.item = parseInt(a.item);
        a.method = parseInt(a.method);
        a.action = currentIndex;
        updateBreadcrum(a);

        console.log('currentIndex : '+currentIndex);

//      swap data & save

        var updatedActions = swapArrayElement(taskData.items[(a.item - 1)].methods[(a.method - 1)].actions,currentIndex-1,(currentIndex-2));
        taskData.items[(a.item-1)].methods[(a.method-1)].actions = updatedActions;

        localStorage.setItem('taskData', JSON.stringify(taskData));

        renderCurrentActionList();
        refreshForm();

    }
    else{

        renderCurrentActionList();
        refreshForm();
    }
    return false;

});

// todo - launch modal and get appname if not in lsm and init action list on basis of that

if((localStorage.getItem('userAppType') == "undefined") || (localStorage.getItem('userAppType') == "") || (localStorage.getItem('userAppType') == null)){
//    $('#userAppTypeModal').modal('show');
    $('#userAppTypeModal').modal({backdrop: 'static', keyboard: false})
}
else{
    $('#app-name').html(JSON.parse(localStorage.getItem('userAppType')).toUpperCase() + ' Admin <i class="fa fa-fw fa-edit">');

    taskData =   JSON.parse(localStorage.getItem('taskData'));

    taskData.appName = JSON.parse(localStorage.getItem('userAppType'));
    localStorage.setItem('taskData', JSON.stringify(taskData));
};

var updateUserAppType = function(userAppType){
    localStorage.setItem('userAppType', JSON.stringify(userAppType));
    $('#app-name').html(userAppType.toUpperCase() + ' Admin <i class="fa fa-fw fa-edit">');

    taskData =   JSON.parse(localStorage.getItem('taskData'));

    taskData.appName = userAppType;
    localStorage.setItem('taskData', JSON.stringify(taskData));
    initactionList();

    location.reload();
};


$( "#saveUserAppType" ).click(function() {

    var userAppType = $('#selectedUserAppType').val();

    updateUserAppType(userAppType);
    $('#userAppTypeModal').modal('hide');
});


$( ".logo" ).click(function() {
    $('#userAppTypeModal').modal({backdrop: 'static', keyboard: false});
});

