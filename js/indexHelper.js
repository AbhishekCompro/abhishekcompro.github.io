/**
 * Created by AbhishekK on 2/2/2016.
 */

function updateBreadcrum(data){

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
}

function addNewMethod(el,clickedAddMethodNodeDataTree){
console.log('***** ' + clickedAddMethodNodeDataTree.item);

    var a = $.extend(true, {}, clickedAddMethodNodeDataTree);
    a.item = parseInt(a.item);
    a.method = parseInt(a.method) + 1;
    a.action = 1;
    updateBreadcrum(a);

    el.append('<li data-tree=\'{"item":"'+parseInt(a.item)+'","method":"'+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+'","action":""}\' class="active treeview method-node">    <a href="#"><i class="fa fa-circle-o"></i> Method '+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+' <i class="fa fa-angle-left pull-right"></i>    <span class="label pull-right bg-red delete-method-node"><i class="fa fa-times"></i></span>    </a>    <ul class="treeview-menu action-tree">    <li data-tree=\'{"item":"' + parseInt(clickedAddMethodNodeDataTree.item) + '","method":"'+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+'","action":"1"}\' class="action-node active">    <a href="#"><i class="fa fa-circle-o"></i> Action 1 <span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span></a>    </li>    <li data-tree=\'{"item":"1","method":"'+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+'","action":"1"}\' class="add-action"><a href="#"><i class="fa fa-plus-square-o text-lime"></i> <span>Add New Action</span></a></li>    </ul>    </li>');

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

$('.sidebar-menu').on('click', '.add-method', function() {

    $('.method-node').removeClass('active');

    var el = $(this);
    var clickedAddMethodNodeDataTree = el.data('tree');

    var methodTree = el.parent('.method-tree');
    addNewMethod(methodTree,clickedAddMethodNodeDataTree);
    el.prev().find('.delete-method-node').remove();
    el.remove();

    methodTree.append('<li data-tree=\'{"item":"'+(parseInt(clickedAddMethodNodeDataTree.item))+'","method":"'+(parseInt(clickedAddMethodNodeDataTree.method) + 1)+'","action":""}\' class="add-method"><a href="#"><i class="fa fa-plus-square-o text-aqua"></i> <span>Add New Method</span></a></li>');

});

$('.sidebar-menu').on('click', '.add-action', function() {

    $('.action-node').removeClass('active');

    var el = $(this);
    var clickedAddActionNodeDataTree = el.data('tree');

    var actionTree = el.parent('.action-tree');
    addNewAction(actionTree,clickedAddActionNodeDataTree);
    el.prev().find('.delete-action-node').remove();
    el.remove();
    actionTree.append('<li data-tree=\'{"item":"'+(parseInt(clickedAddActionNodeDataTree.item))+'","method":"'+(parseInt(clickedAddActionNodeDataTree.method))+'","action":"'+(parseInt(clickedAddActionNodeDataTree.action) + 1)+'"}\' class="add-action"><a href="#"><i class="fa fa-plus-square-o text-lime"></i> <span>Add New Action</span></a></li>');

});


$('.sidebar-menu').on('click', '.item-node', function(event) {
    //console.log($(event.target).parent().attr('class'));
    var targetNode = $(event.target).parent();

    var el = $(this);
    var clickedItemNodeDataTree = targetNode.data('tree');
    updateBreadcrum(clickedItemNodeDataTree);
});


$('.sidebar-menu').on('click', '.method-node', function() {
    //console.log($(event.target).parent().attr('class'));
    var targetNode = $(event.target).parent();

    var el = $(this);
    var clickedAddActionNodeDataTree = targetNode.data('tree');
    updateBreadcrum(clickedAddActionNodeDataTree);

    $('.method-node').removeClass('active');
    el.addClass( 'active' );

});

$('.sidebar-menu').on('click', '.action-node', function() {
    //console.log($(event.target).parent().attr('class'));
    var targetNode = $(event.target).parent();

    var el = $(this);
    var clickedAddActionNodeDataTree = targetNode.data('tree');
    updateBreadcrum(clickedAddActionNodeDataTree);
    $('.action-node').removeClass('active');
    el.addClass( 'active' );

});
$('.sidebar-menu').on('click', '.delete-action-node', function() {

    $('.action-node').removeClass('active');

    var el = $(this);

    var actionTree = el.parent().parent('.action-node');

    //todo: delete data from lsm

    actionTree.prev().find('a').append('<span class="label pull-right bg-red delete-action-node"><i class="fa fa-times"></i></span>');

    var currentAddActionData = actionTree.next().data('tree');
    var updatedAddActionData = {"item":currentAddActionData.item,"method":currentAddActionData.method,"action":(parseInt(currentAddActionData.action) - 1)};
    actionTree.next().data('tree', updatedAddActionData);

    updateBreadcrum({"item":"","method":"","action":""});
    actionTree.remove();

    delete taskData.items[parseInt(currentAddActionData.item)-1].methods[parseInt(currentAddActionData.method)-1].actions[parseInt(currentAddActionData.action)-1];

});

$('.sidebar-menu').on('click', '.delete-method-node', function() {

    $('.method-node').removeClass('active');

    var el = $(this);

    var methodTree = el.parent().parent('.method-node');

    //todo: delete data from lsm

    methodTree.prev().find('a').append('<span class="label pull-right bg-red delete-method-node"><i class="fa fa-times"></i></span>');

    var currentAddMethodData = methodTree.next().data('tree');

    // todo - update taskData & LSM
    //currentAddMethodData

    var updatedAddMethodData = {"item":currentAddMethodData.item,"method":(parseInt(currentAddMethodData.method) - 1),"action":""};
    methodTree.next().data('tree', updatedAddMethodData);

    updateBreadcrum({"item":"","method":"","action":""});
    methodTree.remove();

    delete taskData.items[parseInt(currentAddMethodData.item)-1].methods[parseInt(currentAddMethodData.method)-1];

});
