/**
 * Created by Jibin_ism on 20-Jun-15.
 */

var BASE_URL = window.location.protocol + "//" + window.location.host + "/api";
//var BASE_URL = window.location.protocol + "//" + window.location.hostname + "/api";
var REMEDY_FEED_URL = BASE_URL + "/remedy/all/";

var app = angular.module('remedyShare', []);

app.directive('remedy-feed', function () {
    return {
        restrict: 'E',
        scope: {
            remedy: '='
        },
        templateUrl: '../scripts/remedyFeed.html'
    }
});


app.service('remedyRetrieverService', function ($http) {
    var remedyApi = {};
    remedyApi.getRemedies = function () {
        return $http({
            url: REMEDY_FEED_URL,
            method: "GET",
            headers: {
                'x-service-id':'webApp1958-2013@ISM'
            }
        })
    };
    return remedyApi;
});

app.controller('remedyController', function ($scope, remedyRetrieverService) {
    $scope.remedies = [];
    remedyRetrieverService.getRemedies().success(function(response){
        console.log("Success: (APP Controller)"+JSON.stringify(response));
       $scope.remedies = response.data.remedies;
    });
});
