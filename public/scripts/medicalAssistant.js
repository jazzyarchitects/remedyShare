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
    startImageSlider();
});

function startImageSlider() {
    setInterval(imageChanger, 5000);
}

function imageChanger() {
    imgTag.fadeOut(250,function(){
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