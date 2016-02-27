/**
 * Created by Jibin_ism on 20-Jun-15.
 */

var url;
var app = angular.module('remedyShare', []);
var userGlobal;


app.controller('remedyController', function ($scope) {
    $scope.remedies = [];
    $scope.user = undefined;
    $scope.comments = [];

    $scope.guest = $.cookie("guest") === "true" || false;

    $scope.__loadRemedies = function (url) {
        apiAjax({
            method: 'GET',
            url: url,
            success: function (result) {
                setTimeout(function(){
                    $("#refreshImage").removeClass("refreshImageLoading");
                },1000);
                $scope.$apply(function () {
                    $scope.remedies = result.data.remedies;
                });
            },
            error: function(err){
                $("#refreshImage").removeClass("refreshImageLoading");
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
        if (!$scope.guest) {
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
            if ($scope.remedy._id.toString() === _id.toString()) {
                $scope.$apply(function () {
                    if ($scope.remedy.upvoted) {
                        $scope.remedy.stats.upvote--;
                    } else {
                        $scope.remedy.stats.upvote++;
                    }
                    $scope.remedy.upvoted = !$scope.remedy.upvoted;
                    if ($scope.remedy.upvoted) {
                        if ($scope.remedy.downvoted) {
                            $scope.remedy.stats.downvote--;
                        }
                        $scope.remedy.downvoted = false;
                    }
                });
            }

            apiAjax({
                method: 'PUT',
                url: '/remedy/' + _id + "/upvote"
            });
        } else {
            showLoginPopup();
        }
    };

    $scope.downvote = function (_id) {
        if (!$scope.guest) {
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
            if ($scope.remedy._id.toString() === _id.toString()) {
                $scope.$apply(function () {
                    if ($scope.remedy.downvoted) {
                        $scope.remedy.stats.downvote--;
                    } else {
                        $scope.remedy.stats.downvote++;
                    }
                    $scope.remedy.downvoted = !$scope.remedy.downvoted;
                    if ($scope.remedy.downvoted) {
                        if ($scope.remedy.upvoted) {
                            $scope.remedy.stats.upvote--;
                        }
                        $scope.remedy.upvoted = false;
                    }
                });
            }

            apiAjax({
                method: 'PUT',
                url: '/remedy/' + _id + "/downvote"
            });
        } else {
            showLoginPopup();
        }
    };

    $scope.showRemedy = function (id) {
        apiAjax({
            method: 'GET',
            url: '/remedy/' + id,
            success: function (result) {
                $scope.$apply(function () {
                    $scope.comments = [];
                    $scope.remedy = result.data;
                    $scope.loadComments(result.data._id);
                });
            },
            preExecute: function () {
                window.localStorage.removeItem("id");
                $("addCommentInput").val("");
            }
        })
    };

    $scope.refresh = function () {
        $("#refreshImage").addClass("refreshImageLoading");
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


        var method = 'POST';
        var url='/remedy/';
        var alertTitle= "Remedy saved";
        var update=false;
        var id=$scope.remedy._id;
        if ($scope.remedy._id) {
            //Update
            url = url+$scope.remedy._id;
            method= 'PUT';
            alertTitle= "Remedy updated";
            update=true;
        }
        apiAjax({
            method: method,
            url: url,
            data: {
                title: title,
                description: description,
                tags: tags,
                references: references,
                diseases: diseases
            },
            success: function (result) {
                bootbox.alert(alertTitle, function () {
                    console.log("Remedy saved sucessfully");
                });
                console.log("Saved remedy: " + JSON.stringify(result));
                //$scope.loadMyRemedies(1);
                $scope.$apply(function () {
                    if(!update) {
                        $scope.remedies.push(result.data)
                    }else{
                        var object = $.grep($scope.remedies, function (e) {
                            return e._id == id;
                        });
                        $scope.remedies[$scope.remedies.indexOf(object[0])] = result.data;
                    }
                    $scope.remedy = {};
                });
            }
        });
    };

    $scope.new = function () {
        $scope.remedy = {}
    };

    $scope.openRemedy = function (id) {
        $.cookie("id", id);
        window.open('/app/remedy', "_parent");
    };

    $scope.loadThisRemedy = function () {
        var id = $.cookie("id");
        $scope.showRemedy(id);
    };

    $scope.addComment = function (id) {
        if ($scope.guest) {
            showLoginPopup();
            return;
        }
        var comment = $("#addCommentInput").val().trim();
        apiAjax({
            url: '/remedy/' + id + '/comment',
            method: 'POST',
            data: {
                comment: comment
            },
            success: function (result) {
                $scope.$apply(function () {
                    $scope.comments.push(result.data);
                });
            }
        });
    };

    $scope.loadComments = function (id) {
        apiAjax({
            url: '/remedy/' + id + '/comments',
            method: 'GET',
            success: function (result) {
                $scope.$apply(function () {
                    $scope.comments = result.data.comments;
                });
            }
        });
    };

    $scope.deleteComment = function (id) {
        apiAjax({
            url: '/comment/' + id,
            method: 'DELETE',
            success: function (result) {
                $scope.$apply(function () {
                    var object = $.grep($scope.comments, function (e) {
                        return e._id == id;
                    });
                    $scope.comments.splice($scope.comments.indexOf(object[0]), 1);
                });
            }
        })

    };

    $scope.deleteRemedy = function (id) {
        bootbox.dialog({
            title: "Confirm deletion",
            message: "Are you sure you want to delete this remedy? This cannot be undone",
            buttons: {
                danger: {
                    label: 'Delete',
                    className: 'btn-danger',
                    callback: function () {
                        $scope.$apply(function () {
                            var object = $.grep($scope.remedies, function (e) {
                                return e._id == id;
                            });
                            $scope.remedies.splice($scope.remedies.indexOf(object[0]), 1);
                        });

                        apiAjax({
                            url: '/remedy/' + id,
                            method: 'DELETE',
                            success: function (result) {
                                //console.log("Delete remedy: "+JSON.stringify(result));
                            }
                        })
                    }
                },
                main: {
                    label: 'Cancel'
                }
            }
        });


    };

    //$scope.loadRemedies();

});

app.controller('userController', function ($scope) {
    $scope.user = undefined;
    $scope.loadUserDetails = function () {
        apiAjax({
            method: 'GET',
            url: '/user/',
            success: function (result) {
                $scope.$apply(function () {
                    $scope.user = result.data;
                    window.sessionStorage.setItem("id", result.data._id);
                });
            }
        });
    };
});

function redirectToNew() {
    window.open('/app/my/remedy', "_parent");
}


function showLoginPopup() {
    $("#loginModal").modal();
}

/*

 var index=array.map(function(item){
 return item.id
 }).indexOf("abc");
 array.splice(index, 1);
 */