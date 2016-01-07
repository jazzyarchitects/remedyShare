/**
 * Created by Jibin_ism on 22-Jun-15.
 */
//var BLOG_DETAIL_URL = "http://localhost:3000/api/blog/";
//$locationArray = window.location.href.split('/');
//var id = $locationArray.reverse()[0].replace("#", "");

app.factory('blogRetriever', function ($http, $q) {
    var factory = {};
    factory.getList = function () {
        return $http.get(BLOG_DETAIL_URL + id).then(function (response) {
            //console.log(JSON.stringify(response));
            return response.data;
        })
    };
    return factory;
});

app.controller('blogDetail', function ($scope, blogRetriever) {
    $scope.blog={
        stats:{
            comments: 5
        }
    };
    //$scope.blog = blogRetriever.getList();
    //blogRetriever.getList().then(function (response) {
    //    $scope.blog = response.data;
    //    $scope.commentList = response.data.comments;
    //    //console.log("Controller: " + JSON.stringify(response.data.comments));
    //    //[{"comment":"adsfdgf","commenter":{"_id":"5586abbb8bf18050057c127c","name":"Jibin Mathews","email":"jibinmathews7@gmail.com","mobile":"8877073355"}},{"comment":"ads","commenter":{"_id":"5586abbb8bf18050057c127c","name":"Jibin Mathews","email":"jibinmathews7@gmail.com","mobile":"8877073355"}},{"comment":"","commenter":{"_id":"5586abbb8bf18050057c127c","name":"Jibin Mathews","email":"jibinmathews7@gmail.com","mobile":"8877073355"}},{"comment":"adsfd","commenter":{"_id":"5586abbb8bf18050057c127c","name":"Jibin Mathews","email":"jibinmathews7@gmail.com","mobile":"8877073355"}}]
    //});

    $scope.commentList = {};

    $scope.addComment = function () {
        var comment = $("#comment").val();
        if(comment===null || comment === ""){
            return;
        }
        var data = {
            comment: comment,
            id: id
        };
        $.post("http://localhost:3000/api/comment", data).done(function (data) {
            console.log("POST_REQUEST_DATA: " + JSON.stringify(data));
            $scope.blog = blogRetriever.getList();
        })
            .error(function (e) {
                console.log("POST_ERROR: " + JSON.stringify(e));
            });
        this.incrementComment();
        console.log("Updated scope: "+JSON.stringify(this.blog));
        //$scope.$apply();
    };
    $scope.incrementComment = function () {
        console.log("Stats: " + JSON.stringify(this.blog.stats));
        this.blog.stats.comments = parseInt(this.blog.stats.comments) + 1;
        console.log("Stats2: " + JSON.stringify(this.blog.stats));
    };

});
