/**
 * Created by Jibin_ism on 21-Jun-15.
 */

var USER_DATA_REQUEST_URL="http://localhost:3000/api/getUser";
app.factory('userRetriever',function($http, $q){
   var factory={};
    factory.getUser=function(){
        return $http.get(USER_DATA_REQUEST_URL).then(function(response){
            //console.log(JSON.stringify(response));
           return response.data.data;
        });
    };
    return factory;
});

app.controller('userOperations', function($scope, userRetriever){
   $scope.user=userRetriever.getUser();
    userRetriever.getUser().then(function(user){
        //console.log(("After request: "+JSON.stringify(user)));
        //{"_id":"5586abbb8bf18050057c127c","name":"Jibin Mathews","email":"jibinmathews7@gmail.com","mobile":"8877073355"}
       $scope.user=user;
    });
});

