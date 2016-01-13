/**
 * Created by Jibin_ism on 11-Jan-16.
 */

var h;
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
    h=(contentHeight - 2 * padding - 0.6 * imageWidth) + "px";
    if(userDp.length==0){
        imageWidth = 0;
        h=(contentHeight - 2 * padding - 0.6 * imageWidth-$("#newRemedy").height()-8) + "px";
    }
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
        "margin-left": userDetailsCard.width() * fraction / 2 + "px",
        "margin-top": -imageWidth * 0.6 + "px"
    });
    userDetailsCard.css({
        "margin-top": imageWidth * 0.6 + "px",
        height: h
    });
    $("#userDetails").css({padding: 5 + "px", "padding-top": 0.55 * imageWidth + "px"});


    $("#logout").click(function (e) {
        e.preventDefault();
        logout();
    });
});


function logout(e) {
    $.removeCookie("user", {path: '/'});
    $.removeCookie("accessToken", {path: '/'});
    window.location.replace('/app');
}
