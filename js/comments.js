var mainApp = angular.module("mainApp", []);

mainApp.run(function() {
});



mainApp.controller('myController', function($scope,$http) {

    $scope.test = "ssssswerwerwe";
    
    $http({method:"GET",url:"http://127.0.0.1:7000/utilities/comment.php?b=1&p=27"})
            .then(function(response) {

                $scope.response = response;
                console.log("response",$scope.response);
            });



});