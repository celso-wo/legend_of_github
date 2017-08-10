(function(angular) {
  'use strict';
  angular.module('Legend')
    .controller('LegendController', ['$scope', '$q', 'LegendService', function($scope, $q, LegendService) {

      $scope.model = {
        user1: "mikemajestys",
        user2: "celso-wo"
      };

      $scope.compare = function() {
        var getUser1Repository = LegendService.getRepository($scope.model.user1);

        var getUser2Repository = LegendService.getRepository($scope.model.user2);

        $q.all([getUser1Repository, getUser2Repository]).then(function(data) {
          var user1Result = data[0];
          console.log("repositorio: " + 'mikemajesty', user1Result);
          var user2Result = data[1];
          console.log("repositorio: " + 'celso-wo', user2Result);
        });

        /*$q.all([findUser1, findUser2, findUser1Streak, findUser2Streak, getUser1Repository, getUser2Repository]).then(function(data) {

          var user1Result = data[0];
          console.log("name", user1Result.name);
          console.log("created_at", user1Result.created_at);
          console.log("public_repos", user1Result.public_repos);
          console.log("followers", user1Result.followers);
          console.log("following", user1Result.following);

          var user2Result = data[1];
          console.log("name", user2Result.name);
          console.log("created_at", user2Result.created_at);
          console.log("public_repos", user2Result.public_repos);
          console.log("followers", user2Result.followers);
          console.log("following", user2Result.following);

          var user1Streak = data[2];
          console.log('current streak: ' + $scope.model.user1, user1Streak || 0);

          var user2Streak = data[3];
          console.log('current streak: ' + $scope.model.user2, user2Streak || 0);

          var user1Repository = data[4];
          console.log('repository information: ' + $scope.model.user1, user1Repository || 0);

          var user2Repository = data[5];
          console.log('repository information: ' + $scope.model.user2, user2Repository || 0);
        });*/
      };
    }]);

})(window.angular);   