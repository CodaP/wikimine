'use strict';

// Declare app level module which depends on views, and components
angular.module('wikiMiner', [
  'ngRoute',
  'wikiMiner.view1',
  'wikiMiner.view2',
  'wikiMiner.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
