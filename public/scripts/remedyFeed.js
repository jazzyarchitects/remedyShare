/**
 * Created by Jibin_ism on 31-Dec-15.
 */

var toolbarHeight, windowHeight, contentHeight, padding, dpHolder, userDetailsCard, userDp, dpFrame;
var fraction = 0.5;

$(document).ready(function (e) {

    toolbarHeight = $("#header").height();
    windowHeight = window.innerHeight;

    padding = 0.05 * windowHeight;
    contentHeight = windowHeight - toolbarHeight;

    $("#mainContent").css({height: (contentHeight - padding) + "px", "margin-top": padding});
    $("#userDetailsCard, #feedCard").css({height: (contentHeight - 2 * padding) + "px"});

    userDetailsCard = $("#userDetailsCard");
    userDp = $("#userDp");
    dpFrame = $("#dpframe");

    var imageWidth = userDetailsCard.width() * fraction;
    userDp.css({
        width: imageWidth + "px",
        height: imageWidth + "px",
        "border-radius": imageWidth / 2 + "px",
        "margin-left": 5 + "px",
        "margin-top": 5 + "px"
    });
    dpFrame.css({
        width: imageWidth + 10 + "px",
        height: imageWidth + 10 + "px",
        "border-radius": imageWidth / 2 + 5 + "px",
        "margin-left": userDetailsCard.width() * fraction/2 + "px",
        "margin-top": -imageWidth *0.6 + "px"
    });
    userDetailsCard.css({"margin-top": imageWidth *0.6 + "px", height:  (contentHeight - 2 * padding - 0.6*imageWidth)+"px"});
    $("#userDetails").css({padding: 5+"px", "padding-top": 0.55*imageWidth+"px"});

    $("#logout").click(function (e) {
        e.preventDefault();
        logout();
    });


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
    })

});


function logout(e) {
    $.removeCookie("user", {path: '/'});
    window.location.replace('/app');
}
