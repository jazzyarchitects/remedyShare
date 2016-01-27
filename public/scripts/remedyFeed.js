/**
 * Created by Jibin_ism on 31-Dec-15.
 */

var toolbarHeight, windowHeight, contentHeight, padding, dpHolder, userDetailsCard, userDp, dpFrame;
var fraction = 0.5;
$(document).ready(function(){

    $(".newRemedy").hover(function(e){
       $("#addIcon").attr("src","images/ic_action_add.png");
    }, function(e){
        $("#addIcon").attr("src","images/ic_action_add_dark.png");
    });

    $("#addFab").click(function(e){
       window.open('/app/my/remedy',"_parent");
    });

    $("#homeFab").click(function(e){
       window.open('/app','_parent');
    });

    $("#editUserButton").click(function(e){
       window.open('/app/my/details','_parent');
    });


});

