/**
 * Created by Jibin_ism on 11-Jan-16.
 */

var h;
$(document).ready(function (e) {

    $("head").append('<meta name="google-signin-client_id" content="916983181107-fm83ke0018r1uokii6hge864gk9po8tr.apps.googleusercontent.com">'+
    '<script src="https://apis.google.com/js/platform.js?onload=onLoad" async defer></script>');

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

function onLoad() {
      gapi.load('auth2', function() {
        gapi.auth2.init();
    
      });
    }

function logout(e) {
    try {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }catch(noInternetException){
        console.log("Case only when debugging without net. Gapi not defined")
    }

    $.removeCookie("user", {path: '/'});
    $.removeCookie("accessToken", {path: '/'});
    window.sessionStorage.removeItem("id");
    window.location.replace('/app');
}

function login(){
    $.removeCookie("guest",{path: '/'});
    window.open('/app/login',"_parent");
}
