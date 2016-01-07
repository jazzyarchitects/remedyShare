app.directive('blogcontent', function () {
    return {
        restrict: 'E',
        scope: {
            detail: '='
        },
        templateUrl: 'scripts/directives/blog.html'
    }
});
