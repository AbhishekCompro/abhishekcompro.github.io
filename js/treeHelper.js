/**
 * Created by aksh on 2/3/2016.
 */

$('#scenario').on('click','li' , function() {
    $('#scenario li').attr('class', '');
    $(this).attr('class', 'active');
    var currentScenario = $(this).attr('id');

    $('#b_scenario').html('<i class="fa fa-dashboard"> Scenario ' + $(this).attr('id'));

    localStorage.setItem('currentScenario', currentScenario);

    $('#b_scenario').attr('data-scenario', $(this).attr('id'));

    taskData.scenario = currentScenario;
    localStorage.setItem('taskData', JSON.stringify(taskData));

    refreshForm();

});

$('.sidebar-menu').on('click', '.treeview', function() {
    //resetForm();

});

var resetForm = function(){

    $(".functionDisplayName").text('');
    $("#actionDetailsForm").empty();

}
