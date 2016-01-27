/**
 * Created by Jibin_ism on 30-Dec-15.
 */

var sc = document.createElement("script");
sc.setAttribute("src", "scripts/api.js");
document.head.appendChild(sc);

$(document).ready(function (e) {



    $("#login-form").submit(function (e) {
        e.preventDefault();
        apiAjax({
            method: "POST",
            url: '/user/login',
            data: {
                email: $("#form-username").val(),
                password: $("#form-password").val()
            },
            preExecute:function(){
                $("#progressModal").modal();
                $("#modalHeader").html("Please wait");
                $("#modalBody").html("<div id=\"progressbar\">Logging in</div>");
                $("#progressbar").progressbar({value: false});

            },
            success: function (response) {
                //alert(response);
                //console.log(response);
                window.location.replace("/app");
            },
            error: function (err) {
                console.log(JSON.stringify(err));
                $("#modalHeader").html("Error");
                $("#modalBody").html(err.message.replace(/_/g," "));
            }
        })
    });
});


function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;

    apiAjax({
        method: "POST",
        url: '/user/login/google',
        data: {
            "accessToken": id_token
        },
        preExecute: function(){
            $("#progressModal").modal();
            $("#modalHeader").html("Please wait");
            $("#modalBody").html("<div id=\"progressbar\">Logging in</div>");
            $("#progressbar").progressbar({value: false});
        },
        success: function (response) {
            //alert(response);
            //console.log(response);
            window.location.replace("/app");
        },
        error: function (err) {
            console.log(JSON.stringify(err));
            $("#modalHeader").html("Error");
            $("#modalBody").html(err.message.replace(/_/g," "));
        }
    });

    $("#fbButton").css({width: $("#gooogleButton").width()+"px", height: $("#googleButton").height()+"px"})

}