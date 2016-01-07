app.directive('commentcontent', function () {
    return {
        restrict: 'E',
        scope: {
            detail: '='
        },
        templateUrl: '/scripts/directives/comment.html'
        //template: "hi {{detail.name}}"
    }

});
