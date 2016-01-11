/**
 * Created by Jibin_ism on 31-Dec-15.
 */

var toolbarHeight, windowHeight, contentHeight, padding, dpHolder, userDetailsCard, userDp, dpFrame;
var fraction = 0.5;
$(document).ready(function(){
    apiAjax({
        url: '/user/',
        method: "GET",
        success: function(result){
            //console.log("Success: "+JSON.stringify(result));
            $("#username").val(result.data.name);
            $("#email").val(result.data.email);
        },
        error: function(result){
            //console.log("error"+ JSON.stringify(result));
            $("#modalHeader").html("Error");
            $("#modalBody").html(err.message.replace(/_/g," "));
        }
    });

    $("#addFab").click(function(e){
       window.open('/app/insertRemedy',"_parent");
    });
});

