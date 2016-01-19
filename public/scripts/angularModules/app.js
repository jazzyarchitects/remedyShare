/**
 * Created by Jibin_ism on 20-Jun-15.
 */

var url;
var app = angular.module('remedyShare', []);
var userGlobal;

app.controller('remedyController', function ($scope) {
    $scope.remedies = [];
    $scope.user = undefined;

    $scope.loadUserDetails = function () {
        apiAjax({
            method: 'GET',
            url: '/user/',
            success: function (result) {
                $scope.$apply(function () {
                    $scope.user = result.data;
                });
            }
        });
    };

    $scope.__loadRemedies = function (url) {
        apiAjax({
            method: 'GET',
            url: url,
            success: function (result) {
                $scope.$apply(function () {
                    $scope.remedies = result.data.remedies;
                });
            }
        });
    };

    $scope.loadMyRemedies = function (page) {
        page = page || 1;
        //$("#remForm")[0].reset();
        url = '/user/remedy/' + page;
        $scope.__loadRemedies(url);
    };

    $scope.loadRemedies = function (page) {
        page = page || 1;
        url = '/remedy/all/' + page;
        $scope.__loadRemedies(url);
    };

    $scope.loadUserRemedies = function (page, user) {
        page = page || 1;
        url = '/user/' + user + '/remedy/' + page;
        $scope.__loadRemedies(url);
    };

    $scope.upvote = function (_id) {
        apiAjax({
                method: 'PUT',
                url: '/remedy/' + _id + "/upvote",
                success: function (result) {
                    for (var i = 0; i < $scope.remedies.length; i++) {
                        if ($scope.remedies[i]._id.toString() === _id.toString()) {
                            $scope.$apply(function () {
                                if ($scope.remedies[i].upvoted) {
                                    $scope.remedies[i].stats.upvote--;
                                } else {
                                    $scope.remedies[i].stats.upvote++;
                                }
                                $scope.remedies[i].upvoted = !$scope.remedies[i].upvoted;
                                if ($scope.remedies[i].upvoted) {
                                    if ($scope.remedies[i].downvoted) {
                                        $scope.remedies[i].stats.downvote--;
                                    }
                                    $scope.remedies[i].downvoted = false;
                                }
                            });
                        }
                    }
                }
            }
        )
    };

    $scope.downvote = function (_id) {
        apiAjax({
                method: 'PUT',
                url: '/remedy/' + _id + "/downvote",
                success: function (result) {
                    for (var i = 0; i < $scope.remedies.length; i++) {
                        if ($scope.remedies[i]._id.toString() === _id.toString()) {
                            $scope.$apply(function () {
                                if ($scope.remedies[i].downvoted) {
                                    $scope.remedies[i].stats.downvote--;
                                } else {
                                    $scope.remedies[i].stats.downvote++;
                                }
                                $scope.remedies[i].downvoted = !$scope.remedies[i].downvoted;

                                if ($scope.remedies[i].downvoted) {
                                    if ($scope.remedies[i].upvoted) {
                                        $scope.remedies[i].stats.upvote--;
                                    }
                                    $scope.remedies[i].upvoted = false;
                                }
                            });
                        }
                    }
                }
            }
        )
    };

    $scope.showRemedy = function (id) {
        apiAjax({
            method: 'GET',
            url: '/remedy/' + id,
            success: function (result) {
                $scope.$apply(function () {
                    $scope.remedy = result.data;
                    //console.log("New Remedy: "+JSON.stringify($scope.remedy.description));
                });
            },
            preExecute: function(){
                window.localStorage.removeItem("id");
            }
        })
    };


    $scope.refresh = function () {
        $scope.loadRemedies(undefined, userGlobal);
    };


    function checkForm() {
        if ($("#form_title").val().trim() == "") {
            alert("Title cannot be empty");
            return false;
        }
        if ($("#form_description").val().trim() == "") {
            alert("Description cannot be empty");
            return false;
        }
        return true;
    }

    $scope.saveRemedy = function () {
        if (!checkForm) {
            return;
        }

        var title = $("#form_title").val();
        var description = $("#form_description").val();
        var references = $("#form_references").val();
        var tags = $("#form_tags").val();
        var diseases = $("#form_diseases").val();

        //$scope.$apply(function(){
        //   $scope.remedy = {};
        //});

        apiAjax({
            method: 'POST',
            url: '/remedy/',
            data: {
                title: title,
                description: description,
                tags: tags,
                references: references,
                diseases: diseases
            },
            success: function (result) {
                $scope.loadMyRemedies(1);
            }
        })

    };
    $scope.new = function () {
        $scope.remedy = {}
    };

    $scope.openRemedy = function (id) {
        $.cookie("id",id);
        window.open('/app/remedy', "_parent");
    };

    $scope.loadThisRemedy = function () {
        var id = $.cookie("id");
        $scope.showRemedy(id);
    };

    //$scope.loadRemedies();

});


function redirectToNew() {
    window.open('/app/my/remedy', "_parent");
}

/*

 var index=array.map(function(item){
 return item.id
 }).indexOf("abc");
 array.splice(index, 1);
 */