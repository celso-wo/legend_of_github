"use strict";angular.module("Legend",[]);
"use strict";!function(angular){angular.module("Legend").controller("LegendController",["$scope","$q","RepositoryService","StreakService","InformationService",function($scope,$q,RepositoryService,StreakService,InformationService){$scope.model={user1:"mikemajesty",user2:"samfrezza"},$scope.compare=function(){var getUser1Repository=RepositoryService.getRepository($scope.model.user1),getUser2Repository=RepositoryService.getRepository($scope.model.user2),getUser1Streak=StreakService.findStreak($scope.model.user1),getUser2Streak=StreakService.findStreak($scope.model.user2),getUser1Information=InformationService.findUser($scope.model.user1),getUser2Information=InformationService.findUser($scope.model.user2);$q.all([getUser1Repository,getUser2Repository,getUser1Streak,getUser2Streak,getUser1Information,getUser2Information]).then(function(data){var user1Repository=data[0];console.log("repositorio: "+$scope.model.user1,user1Repository);var user1Streak=data[2];console.log("current streak: "+$scope.model.user1,user1Streak);var user1Information=data[4];console.log("information: "+$scope.model.user1,user1Information),console.log("----------------------------------------------------");var user2Repository=data[1];console.log("repositorio: "+$scope.model.user2,user2Repository);var user2Streak=data[3];console.log("current streak: "+$scope.model.user2,user2Streak);var user2Information=data[5];console.log("information: "+$scope.model.user2,user2Information)})}}])}(window.angular);
"use strict";!function(angular){angular.module("Legend").factory("InformationService",["$http",function($http){var findUser=function(userName){return $http.post("/user",{username:userName}).then(function(res){return res.data})};return{findUser:findUser}}])}(window.angular);
"use strict";!function(angular){angular.module("Legend").factory("RepositoryService",["$http",function($http){var getRepository=function(userName){return $http.post("/repository",{username:userName}).then(function(res){var sumStarAndFork=_.max(_.map(res.data,function(value){return parseInt(value.stars)+parseInt(value.forks)})),bestRepositoty=_.find(res.data,function(value){return parseInt(value.stars)+parseInt(value.forks)==sumStarAndFork}),starts=_.sumBy(res.data,function(value){return parseInt(value.stars)}),forks=_.sumBy(res.data,function(value){return parseInt(value.forks)});return{starts:starts,forks:forks,repositories:res.data,bestRepositoty:bestRepositoty||"noob"}})};return{getRepository:getRepository}}])}(window.angular);
"use strict";!function(angular){angular.module("Legend").factory("StreakService",["$http",function($http){var findStreak=function(userName){return $http.post("/streak",{username:userName}).then(function(res){var currentStreak=[],lastCommit=0;return res.data.forEach(function(data,index){var date=data.date,currentCommit=data.commit;new Date(data.date.replace("-","/")).getTime()<=(new Date).getTime()&&(currentCommit>0&&lastCommit>0||0===index?currentStreak.push({date:date,commit:currentCommit}):currentStreak=[]),lastCommit=data.commit}),currentStreak.length})};return{findStreak:findStreak}}])}(window.angular);