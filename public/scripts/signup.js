/**
 * Created by Jibin_ism on 31-Dec-15.
 */

var sc = document.createElement("script");
sc.setAttribute("src", "scripts/api.js");
document.head.appendChild(sc);

$(document).ready(function (e) {

    $.datepicker.formatDate("dd-mm-yy", new Date());
    $("#dob").datepicker({
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: "dd-mm-yy",
        navigationAsDateFormat: true,
        yearRange: "1900:2099",
        autoSize: true
    });

    $("#signup-form").submit(function (e) {
        e.preventDefault();

        apiAjax({
            url: '/user/signup',
            method: "POST",
            data: getDataJSON(),
            preExecute: function () {
                $("#progressModal").modal();
                $("#modalHeader").html("Please wait");
                $("#modalBody").html("<div id=\"progressbar\">Registering</div>");
                $("#progressbar").progressbar({value: false});
            },
            success:function(result){
                window.location.replace('/app');
            },
            error: function(err){
                console.log("err");
                $("#modalHeader").html("Error");
                $("#modalBody").html(err.message.replace(/_/g," "));
            }
        });
    })
});

function getDataJSON() {
    var array = $("#signup-form").serializeArray();
    var data = {};
    for (var i = 0; i < array.length; i++) {
        data[array[i].name] = array[i].value;
    }
    return data;
}