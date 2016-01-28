/**
 * Created by Jibin_ism on 20-Jun-15.
 */

var url;
var app = angular.module('remedyShare', []);
var userGlobal;

app.controller('userDetailsController', function ($scope) {
    $scope.loadUser = function () {
        apiAjax({
            url: '/user/full',
            method: 'GET',
            success: function (response) {
                console.log("Reponse: " + JSON.stringify(response));
                $scope.$apply(function(){
                   $scope.user = response.data;
                });
            },
            error: function (err) {
                console.log("Error: " + JSON.stringify(err));
            }
        })
    };

});


/*

 var index=array.map(function(item){
 return item.id
 }).indexOf("abc");
 array.splice(index, 1);
 */