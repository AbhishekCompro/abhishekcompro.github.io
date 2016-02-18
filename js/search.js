/**
 * Created by AbhishekK on 2/2/2016.
 */


    $("#searchActions").keyup(function(){

        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val(), count = 0;

        // Loop through the comment list
        $("#layout-skins-list tbody tr").each(function(){

            // If the list item does not contain the text phrase fade it out
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();

                // Show the list item if the phrase matches and increase the count by 1
            } else {
                $(this).show();
                count++;
            }
        });

        // Update the count
        var numberItems = count;
        console.log("Number of Comments = "+count);
    });

// todo - categorize action list
var actionList = {

    action  :   [],

    excel   :   [
        "clickAt(String elementName, int pos)",
        "clickAtPercent(String elementName, int xposPercent, int yposPercent)",
        "rightClickOnCell(String cell)",
        "selectCell(String cell)",
        "selectCellRange(String range, Method Method)",
        "selectColumn(String columnName)",
        "selectRow(int rowNumber)",
        "selectMultiParaText(String elementNameStart, String elementNameEnd, int Start, int End, Method method)",
        "selectText(String elementName, int Start, int End, Method Method)",
        "click(String elementName)",
        "clickAtCurrentPos()",
        "clickAndHoldCurrentPos()",
        "clickAndHold(String elementName)",
        "clickAndWait(String elementName)",
        "doubleClickAndWait()",
        "doubleClick(String elementName)",
        "rightClickCurrentPos()",
        "rightClick(String elementName)",
        "dragAndDropBy(String source, String target)",
        "dragAndDropByOffset(String elementName, int xOffset, int yOffset)",
        "enterText(String text)",
        "enterTextInElement(String elementName, String text)",
        "pressControlA()",
        "pressControlEND()",
        "pressControlENTER()",
        "pressControlHOME()",
        "pressKey(MyKeys MyKeys)",
        "pressNreleaseKey(MyKeys myKeys)",
        "releaseKey(MyKeys MyKeys)",
        "moveByOffset(int xOffset, int yOffset)",
        "moveToElementCenter(String elementName)",
        "moveToElement(String elementName, int xOffset, int yOffset)",
        "moveToElementPercent(String elementName, double xOffsetPercent, double yOffsetPercent)",
        "release(String elementName)",
        "waitFor()",
        "waitForSec(int time)",
        "clearText(String elementName)",
        "scroll(String elementName)",
        "selectFromDropdown(String elementName, String parameter)",
        "selectInputText(String elementName)",
        "skipToNextItem()"]
    ,
    word    :   []
    ,
    ppt     :   []
    ,
    access  :   [
        "clickAt(String elementName, int pos)",
        "clickAtPercent(String elementName, int xposPercent, int yposPercent)",
        "selectMultiParaText(String elementNameStart, String elementNameEnd, int Start, int End, Method methodType)",
        "selectText(String elementName, int start, int end, Method methodType)",
        "click(String elementName)",
        "clickAtCurrentPos()",
        "clickAndHoldCurrentPos()",
        "clickAndHold(String elementName)",
        "clickAndWait(String elementName)",
        "doubleClickAndWait()",
        "doubleClick(String elementName)",
        "rightClickCurrentPos()",
        "rightClick(String elementName)",
        "dragAndDropBy(String source, String target)",
        "dragAndDropByOffset(String elementName, int xOffset, int yOffset)",
        "enterText(String text)",
        "enterTextInElement(String elementName, String text)",
        "pressControlA()",
        "pressControlEND()",
        "pressControlENTER()",
        "pressControlHOME()",
        "pressKey(MyKeys keyName)",
        "pressNreleaseKey(MyKeys keyName)",
        "releaseKey(MyKeys keyName)",
        "moveByOffset(int xOffset, int yOffset)",
        "moveToElementCenter(String elementName)",
        "moveToElement(String elementName, int xOffset, int yOffset)",
        "moveToElementPercent(String elementName, double xOffsetPercent, double yOffsetPercent)",
        "release()",
        "releaseElement(String elementName)",
        "waitFor()",
        "waitForSec(int time)",
        "clearText(String elementName)",
        "scroll(String elementName)",
        "selectFromDropdown(String elementName, String parameter)",
        "selectInputText(String elementName)",
        "skipToNextItem()"
    ]
};

console.log(actionList.excel.length);

var initactionList = function(){

    for(var i=0;i<actionList.action.length;i++){

        $("#layout-skins-list tbody").append('                <tr>                  <td><code>'+actionList.excel[i]+'</code></td>                  <td><a href="#" class="btn btn-primary btn-xs action-details-button"><i class="fa fa-eye"></i></a></td>                </tr>')

    }

    var currentApplication = "access";   // todo - change this & categorize action list
    var filteredActionList;

    if(currentApplication == 'excel'){
        filteredActionList = actionList.excel;
    }
    if(currentApplication == 'word'){
        filteredActionList = actionList.word;
    }
    if(currentApplication == 'ppt'){
        filteredActionList = actionList.ppt;
    }
    if(currentApplication == 'access'){
        filteredActionList = actionList.access;
    }

    for(var i=0;i<filteredActionList.length;i++){

        $("#layout-skins-list tbody").append('                <tr>                  <td><code>'+filteredActionList[i]+'</code></td>                  <td><a href="#" class="btn btn-primary btn-xs action-details-button"><i class="fa fa-eye"></i></a></td>                </tr>')

    }
};

initactionList();

var updateDetailsForm = function(){

    $('#layout-skins-list').on('click', '.action-details-button', function() {
        $("#actionDetailsForm").empty();
    var el = $(this);
    var clickedNodeText = el.parent().parent().text();
    $(".functionDisplayName").text(clickedNodeText.trim());

    var actionNodeFunction =  clickedNodeText.trim().replace(/ *\([^)]*\) */g, "");
    $(".functionDisplayName").attr('name', actionNodeFunction + '()');

        var actionNodeArray ;

        try{
            actionNodeArray = (clickedNodeText.match(/\(([^)]+)\)/)[1]).split(',');
        }catch(e){

        }
            if(actionNodeArray.length >0){

                for(var i=0;i<actionNodeArray.length;i++){
                    console.log('field for: '+actionNodeArray[i].trim());
                    console.log('field for: '+actionNodeArray[i].trim().split(' ')[0])

                        $("#actionDetailsForm").append('<div class="col-sm-12" style="margin: 5px 0px 5px 0px">        <input id="'+actionNodeArray[i].trim().split(' ')[1]+'" type="text" class="form-control" id="" placeholder="'+actionNodeArray[i].trim().split(' ')[1]+'">        </div>');
                }

/*
                console.log('test: '+el.parent().parent().text())

                console.log('test 2: '+ clickedNodeText.match(/\(([^)]+)\)/)[1]);*/


            }


/*        var methodTree = el.parent().parent('.method-node');

        //todo: delete data from lsm
        var removeLSMData = methodTree.data('tree');
        console.log(removeLSMData);

        updateBreadcrum({"item":"","method":"","action":""});

        methodTree.remove();*/

    });









};

updateDetailsForm();