/**
 * Created by Jibin_ism on 04-Oct-15.
 */

var screenshots = [
    'dashboard.jpg', 'doctor.jpg', 'news.jpg', 'search.jpg', 'medicines.jpg'
];
var currentImageIndex = 0;
var imgTag;

$(document).ready(function (e) {
    imgTag = $("#screenshot");
    $('#fullpage').fullpage({
        anchors: ['home', 'details', 'features', 'contact'],
        //to avoid problems with css3 transforms and fixed elements in Chrome, as detailed here: https://github.com/alvarotrigo/fullPage.js/issues/208
        css3: false,
        continuousVertical: true,
        afterLoad: function (anchorLink, index) {
            if (index == 2) {
                $(".appDetailsCard").delay(250).animate({left: 0}, 1000, 'easeOutExpo');
                $(".screenshots").delay(250).animate({left: 0}, 1000, 'easeOutExpo', function () {
                    startImageSlider();
                });
            } else {
                clearInterval(slider);
            }

            $(".defaultMenu").each(function (i, obj) {
                $(this).removeClass("activeMenu");
                if (index - 1 == i) {
                    $(this).addClass("activeMenu");
                }
            });
        }
    });
    $("#meetUs").hover(function () {
        $("#smileImage1").prop("src", "images/ic_action_emo_wink.png");
        $("#smileImage2").prop("src", "images/ic_action_emo_wink.png");
    }, function () {
        $("#smileImage1").prop("src", "images/ic_action_emo_basic.png");
        $("#smileImage2").prop("src", "images/ic_action_emo_basic.png");
    }).click(function (e) {
        window.open("http://www.facebook.com/jibin.mathews7","_blank");
        //window.focus();
        window.location="http://www.facebook.com/aanisha.ismd";
        //chrome.windows.create({url: ['http://www.facebook.com/jibin.mathews7','http://www.facebook.com/aanisha.ismd']});
    });

});
var slider;
function startImageSlider() {
    slider = setInterval(imageChanger, 5000);
}

function imageChanger() {
    imgTag.fadeOut(250, function () {
        imgTag.attr("src", "images/screenshots/" + screenshots[getNextImageIndex()]);
        imgTag.fadeIn(250);
    });
}

function getNextImageIndex() {
    if (currentImageIndex == 4) {
        currentImageIndex = 0;
    } else {
        currentImageIndex++;
    }
    return currentImageIndex;
}