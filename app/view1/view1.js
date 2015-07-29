'use strict';

angular.module('Sauron.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html'
  });
}])

.controller('View1Ctrl', [
  '$scope',
  '$interval',
  '$http',
  'MESOS_MASTERS',
  function($scope, $interval, $http, MESOS_MASTERS) {
  $scope.find_master = function(){

    angular.forEach(MESOS_MASTERS, function(master){
      $http.get(master + 'master/stats.json').success(function(result){
        if(result.hasOwnProperty('elected') && result['elected']){
          $scope.current_master = master;
          $scope.current_master_stats = result;
          $http.get($scope.current_master + 'state.json')
          .success(
            function(cluster_stats){
              if(angular.isDefined(cluster_stats) && cluster_stats.hasOwnProperty('frameworks')){
                var running_frameworks = {};
                angular.forEach(cluster_stats['frameworks'], function(framework){
                  running_frameworks[framework['id']] = framework;
                });
                $scope.running_frameworks = running_frameworks;
                console.log($scope.running_frameworks);
                $scope.frameworks = Object.keys($scope.running_frameworks);
              }
            }
          );
        }
      });
    });

  };
  var polling = $interval($scope.find_master, 5000);

  $scope.$on("$destroy", function() {
    if (angular.isDefined(polling)) {
      $interval.cancel(polling);
      polling = undefined;
    }
  });

  $scope.find_master();
}]);
