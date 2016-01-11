/**
 * Created by Jibin_ism on 20-Jun-15.
 */

var BASE_URL = window.location.protocol + "//" + window.location.host + "/api";
//var BASE_URL = window.location.protocol + "//" + window.location.hostname + "/api";
var REMEDY_FEED_URL = BASE_URL + "/remedy/all/";

var app = angular.module('remedyShare', []);
var userGlobal;

app.directive('remedy-feed', function () {
    return {
        restrict: 'E',
        scope: {
            remedy: '='
        },
        templateUrl: '../scripts/remedyFeed.html'
    }
});


app.controller('remedyController', function ($scope) {
    $scope.remedies = [];
    //remedyRetrieverService.getRemedies().success(function(response){
    //    console.log("Success: (APP Controller)"+JSON.stringify(response));
    //   $scope.remedies = response.data.remedies;
    //});

    $scope.loadRemedies = function (page, user) {
        page = page || 1;
        userGlobal=user;
        var url='/remedy/all/'+page;
        if(user){
            url='/'+user+'/remedy/all/'+page;
        }
        apiAjax({
            method: 'GET',
            url: url,
            success: function (result) {
                $scope.$apply(function () {
                    $scope.remedies = result.data.remedies;
                    //console.log("Remedies: " + JSON.stringify(result.data.remedies));
                });
            }
        });
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
                                if($scope.remedies[i].upvoted){
                                    if($scope.remedies[i].downvoted) {
                                        $scope.remedies[i].stats.downvote --;
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

                                if($scope.remedies[i].downvoted){
                                    if($scope.remedies[i].upvoted) {
                                        $scope.remedies[i].stats.upvote --;
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

    $scope.refresh = function () {
        $scope.loadRemedies(undefined, userGlobal);
    };

    //$scope.loadRemedies();

})
;
