/**
 * Created by aksh on 3/4/2016.
 */




var renderTreeFromLsm = function(){

    var taskData =   JSON.parse(localStorage.getItem('taskData'));


    for(var j=0;j<taskData.items[i].methods.length;j++){

        if(taskData.items[i].methods[j].init){
           // add method j inside item i

            // if not last method


            // add delete and append ad new method if last method

            for(var k=0;k<taskData.items[i].methods[j].actions.length;k++){
                if(taskData.items[i].methods[j].actions[k].init){

                // add actions inside method j


                    // if not last action


                    // add delete and append ad new action if last action
                }
            }
        }
    }
};


var renderPathwayFromLsm = function(){

};