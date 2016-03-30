/**
 * Created by AbhishekK on 2/2/2016.
 */

function updateBreadcrum(data){

    console.log('update br called ');
    console.log(data);

    if(data != undefined){

        console.log('updating breadcrum for .. ' + data.item + data.method + data.action );
        $('#b_item').html('Item ' + data.item);
        $('#b_method').html('Method ' + data.method);
        $('#b_action').html('Action ' + data.action);


        $('#b_item').attr('data-item', data.item);
        $('#b_method').attr('data-method', data.method);
        $('#b_action').attr('data-action', data.action);

        localStorage.setItem('currentItemNumber', JSON.stringify(data.item));
        localStorage.setItem('currentMethodNumber', JSON.stringify(data.method));
        localStorage.setItem('currentActionNumber', JSON.stringify(data.action));

        // todo: set currentTreeNode here

    }
    refreshForm();
    //setTimeout(function(){ refreshForm(); }, 500);

}

function addNewMethod(el,clickedAddMethodNodeDataTree){
console.log('***** ' + clickedAddMethodNodeDataTree.item);

    var a = $.extend(true, {}, clickedAddMethodNodeDataTree);
    a.item = parseInt(a.item);
    a.method = parseInt(a.method) + 1;
    a.action = 1;
    updateBreadcrum(a);

    el.append('<li data-tree=\'{"item":"'+parseInt(a.item)+'","method":"'+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+'","action":""}\' class="active treeview method-node">    <a href="#"><i class="fa fa-circle-o"></i> Method '+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+' <span href="#" class="reorder-up pull-right" style="padding-right:70px"><i class="fa fa-fw fa-arrow-up"></i></span><span href="#" class="reorder-down pull-right" style="padding-right:40px"><i class="fa fa-fw fa-arrow-down"></i></span> <i class="fa fa-angle-left pull-right"></i>    <span class="label pull-right bg-red delete-method-node"><i class="fa fa-times"></i></span>    </a>    <ul class="treeview-menu action-tree" style="display: none;">    <li data-tree=\'{"item":"' + parseInt(clickedAddMethodNodeDataTree.item) + '","method":"'+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+'","action":"1"}\' class="action-node active">    <a href="#"><i class="fa fa-circle-o"></i> Action 1 <!--<span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span>--></a>    </li>    <li data-tree=\'{"item":"'+parseInt(a.item)+'","method":"'+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+'","action":"1"}\' class="add-action"><a href="#" class="copy-action"><i class="fa fa-copy text-lime"></i> <span>Duplicate</span></a></li>    </ul>    </li>');

}

function addNewAction(el,clickedAddActionNodeDataTree){
    console.log('***** ' + clickedAddActionNodeDataTree.item);

    var a = $.extend(true, {}, clickedAddActionNodeDataTree);;
    a.item = parseInt(a.item);
    a.method = parseInt(a.method);
    a.action = parseInt(a.action) + 1;
    updateBreadcrum(a);

    el.append('<li data-tree=\'{"item":"'+parseInt(clickedAddActionNodeDataTree.item)+'","method":"'+(parseInt(clickedAddActionNodeDataTree.method))+'","action":"'+(parseInt(clickedAddActionNodeDataTree.action) + 1)+'"}\' class="active action-node">    <a href="#"><i class="fa fa-circle-o"></i> Action '+(parseInt(clickedAddActionNodeDataTree.action) + 1)+' <span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span></a>    </li>');

}

$('.sidebar-menu').on('click', '.add-method', function(e) {
    var el = $(this);
    var clickedAddMethodNodeDataTree = el.data('tree');

    var taskData =   JSON.parse(localStorage.getItem('taskData'));

    if(taskData.items[parseInt(clickedAddMethodNodeDataTree.item)-1].methods.length >= parseInt(clickedAddMethodNodeDataTree.method)){
        console.log('111');

        $('.method-node').removeClass('active');

        var methodTree = el.parent('.method-tree');
        addNewMethod(methodTree, clickedAddMethodNodeDataTree);
        el.prev().find('.delete-method-node').remove();
        el.remove();

        methodTree.append('<li data-tree=\'{"item":"' + (parseInt(clickedAddMethodNodeDataTree.item)) + '","method":"' + (parseInt(clickedAddMethodNodeDataTree.method) + 1) + '","action":""}\' class="add-method"><a href="#"><i class="fa fa-plus-square-o text-aqua"></i> <span>Add New Method</span></a></li>');

        $('.reorder-up, .reorder-down').hide();
        renderCurrentActionList();
    }
    else{
        console.log('112');
        alert('Please save previous method data');
        //e.stopPropagation();
    };

});

$('.sidebar-menu').on('click', '.add-action', function(e) {

    var el = $(this);
    var clickedAddActionNodeDataTree = el.data('tree');

    clickedAddActionNodeDataTree.action = (el.index());

    console.log(clickedAddActionNodeDataTree.action);

    var actionTree = el.parent('.action-tree');
    addNewAction(actionTree,clickedAddActionNodeDataTree);
    el.prev().find('.delete-action-node').remove();
    el.remove();
    actionTree.append('<li data-tree=\'{"item":"'+(parseInt(clickedAddActionNodeDataTree.item))+'","method":"'+(parseInt(clickedAddActionNodeDataTree.method))+'","action":"'+(parseInt(clickedAddActionNodeDataTree.action) + 1)+'"}\' class="add-action"><a href="#" class="copy-action"><i class="fa fa-copy text-lime"></i> <span>Duplicate</span></a></li>');

    $('.method-details-section').hide();
    $('.action-details-section').show();
    renderCurrentActionList();
    e.stopPropagation();
});


$('.sidebar-menu').on('click', '.item-node', function(event) {
    //console.log($(event.target).parent().attr('class'));
    var targetNode = $(event.target).parent();

    var el = $(this);
    var clickedItemNodeDataTree = targetNode.data('tree');
    updateBreadcrum(clickedItemNodeDataTree);
    //event.stopPropagation();
});


$('.sidebar-menu').on('click', '.method-node', function(e) {
    //console.log($(event.target).parent().attr('class'));
    var targetNode = $(e.target).parent();

    var el = $(this);
    var clickedAddActionNodeDataTree = targetNode.data('tree');
    updateBreadcrum(clickedAddActionNodeDataTree);

    //$('.method-node').removeClass('active');
    el.addClass( 'active' );
    //e.stopPropagation();
});

$('.sidebar-menu').on('click', '.action-node', function(e) {
    //console.log($(event.target).parent().attr('class'));
    var targetNode = $(e.target).parent();

/*    console.log($(this).index());
    console.log(targetNode.parent().find('li').size());

    console.log($(this).parent().parent().data('tree'));*/

    var el = $(this);

    var clickedAddActionNodeDataTree = $(this).parent().parent().data('tree');

    clickedAddActionNodeDataTree.action = ($(this).index() + 1);

    console.log(clickedAddActionNodeDataTree);
    updateBreadcrum(clickedAddActionNodeDataTree);
    $('.action-node').removeClass('active');
    el.addClass( 'active' );
    e.stopPropagation();
});

$('.sidebar-menu').on('click', '.delete-action-node', function(e) {
    var taskData =   JSON.parse(localStorage.getItem('taskData'));

     console.log($(this).parent().parent().index());
     //console.log($(event.target).parent().find('li').size());

     console.log($(this).parent().parent().parent().parent().data('tree'));

    $('.action-node').removeClass('active');

    var el = $(this);

    var actionTree = el.parent().parent('.action-node');

    if(actionTree.prev().prev().length !==0 ){
        actionTree.prev().find('a').append('<span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span>');
    }

    var currentAddActionData = $(this).parent().parent().parent().parent().data('tree');
    currentAddActionData.action = ($(this).parent().parent().index() + 1);

    console.log(currentAddActionData);

    var updatedAddActionData = {"item":currentAddActionData.item,"method":currentAddActionData.method,"action":(parseInt(currentAddActionData.action) - 1)};

    actionTree.next().data('tree', updatedAddActionData);

    updateBreadcrum({"item":currentAddActionData.item,"method":currentAddActionData.method,"action":(parseInt(currentAddActionData.action) - 1)});
    actionTree.remove();

    taskData.items[parseInt(currentAddActionData.item)-1].methods[parseInt(currentAddActionData.method)-1].actions.splice(parseInt(currentAddActionData.action)-1, 1);
	
	localStorage.setItem('taskData', JSON.stringify(taskData));
    renderCurrentActionList();
    e.stopPropagation();
});

$('.sidebar-menu').on('click', '.delete-method-node', function(e) {

    $('.method-node').removeClass('active');

    var el = $(this);

    var methodTree = el.parent().parent('.method-node');

    methodTree.prev().find('a').first().append('<span class="label pull-right bg-red delete-method-node"><i class="fa fa-times"></i></span>');

    var currentAddMethodData = methodTree.next().data('tree');

    var updatedAddMethodData = {"item":currentAddMethodData.item,"method":(parseInt(currentAddMethodData.method) - 1),"action":""};
    methodTree.next().data('tree', updatedAddMethodData);

    updateBreadcrum({"item":"","method":"","action":""});
    methodTree.remove();

    taskData.items[parseInt(currentAddMethodData.item)-1].methods.splice(parseInt(currentAddMethodData.method)-1, 1);
	
	localStorage.setItem('taskData', JSON.stringify(taskData));
    renderCurrentActionList();
    refreshForm();
    e.stopPropagation();
});


$('.sidebar-menu').on('click', '.copy-action', function(e) {

    var el = $(this).parent();
    var clickedAddActionNodeDataTree = el.data('tree');
    var taskData =   JSON.parse(localStorage.getItem('taskData'));

    if(taskData.items[parseInt(clickedAddActionNodeDataTree.item)-1].methods[parseInt(clickedAddActionNodeDataTree.method)-1].actions.length !== 0){
        console.log('111');



    var elSelectedActionNode = $('.action-node').filter('.active').index();

    if(elSelectedActionNode == -1){

        var actionLength = $('.item-node').eq(currentItemNumber-1).find('.method-node').eq(currentMethodNumber -1).find('.action-node').length;
        //elSelectedActionNode =  $('.item-node').eq(currentItemNumber-1).find('.method-node').eq(currentMethodNumber -1).find('.action-node').eq(actionLength -1);
        elSelectedActionNode = actionLength -1;
    }

    addValue(taskData.items[parseInt(clickedAddActionNodeDataTree.item)-1].methods[parseInt(clickedAddActionNodeDataTree.method)-1],'actions', (parseInt(clickedAddActionNodeDataTree.action)) ,taskData.items[parseInt(clickedAddActionNodeDataTree.item)-1].methods[parseInt(clickedAddActionNodeDataTree.method)-1].actions[parseInt(elSelectedActionNode)]);
    localStorage.setItem('taskData', JSON.stringify(taskData));

        $('.action-node').removeClass('active');


    var currentAction = taskData.items[parseInt(clickedAddActionNodeDataTree.item)-1].methods[parseInt(clickedAddActionNodeDataTree.method)-1].actions[parseInt(elSelectedActionNode)];

    $('.item-node').eq((parseInt(clickedAddActionNodeDataTree.item) - 1)).find('.method-node').eq((parseInt(clickedAddActionNodeDataTree.method) - 1)).find('.add-action').click();

    renderCurrentActionList();

        $('.item-node').eq(parseInt(clickedAddActionNodeDataTree.item)-1).find('.method-node').eq(parseInt(clickedAddActionNodeDataTree.method)-1).find('.action-node').eq(parseInt(clickedAddActionNodeDataTree.action)).html('<a href="#"><i class="fa fa-circle-o"></i>'+currentAction.name+'<span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span></a>');

        $('.item-node').eq(parseInt(clickedAddActionNodeDataTree.item)-1).find('.method-node').eq(parseInt(clickedAddActionNodeDataTree.method)-1).find('.action-node').eq(parseInt(clickedAddActionNodeDataTree.action)).addClass('active');
        refreshForm();
    }
    else{
        console.log('112');
        alert('Please save first action data');
        e.stopPropagation();
    }
    taskData =   JSON.parse(localStorage.getItem('taskData'));
});

$('.reorder-up, .reorder-down').hide();

$('.sidebar-menu').on('click', '.method-node, .item-node', function(e) {

    $('.reorder-up, .reorder-down').hide()
});

$('.sidebar-menu').on('click', '.action-node', function(e) {
    var el = $(this).parents('.method-node').first();

    el.find('.reorder-up, .reorder-down').show()
});


/*$('.sidebar-menu').on('click', '.method-node', function(e) {
    $(this).parent().find('.add-action').hide();
    var currentMethodNodeData = $(this).parent().data('tree');
    if(taskData.items[parseInt(currentMethodNodeData.item)-1].methods[parseInt(currentMethodNodeData.method)-1]){
        if(taskData.items[parseInt(currentMethodNodeData.item)-1].methods[parseInt(currentMethodNodeData.method)-1].actions.length > 0){
            $(this).parent().find('.add-action').show();
        }
    }
});*/

