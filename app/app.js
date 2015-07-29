'use strict';

// Declare app level module which depends on views, and components
angular.module('Sauron', [
  'ngRoute',
  'Sauron.view1',
  'Sauron.view2',
  'Sauron.view3',
  'Sauron.directive',
  'Sauron.version',
  'ui.bootstrap'
])
.constant('MESOS_MASTERS', [
  'http://mesos-master1:5050/',
  'http://mesos-master2:5050/',
  'http://mesos-master3:5050/',
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
