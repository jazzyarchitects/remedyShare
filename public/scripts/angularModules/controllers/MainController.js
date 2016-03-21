var feedUrl=window.location.host+"/api/remedy/all/";

app.factory('remedyList', function($http, $q){
   var factory={};
    factory.getList=function(){
        return $http.get(feedUrl).then(function(response){
            //console.log(JSON.stringify(response));
            return response.data;
        })
    };
    return factory;
});

app.controller('MainController', function ($scope, blogRetriever ,$window) {
    $scope.blogs = blogRetriever.getList();
    blogRetriever.getList().then(function(items){
        //console.log("Controller: "+JSON.stringify(items.data.blogs));
        $scope.blogs=items.data.blogs;
    });
    $scope.showDetails=function(id){
        $window.open('http://localhost:3000/blog/'+id,"_parent");
    }
});
