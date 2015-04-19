'use strict';

// Declare app level module which depends on views, and components
angular.module('wikiMiner', [
  'ngRoute',
  'wikiMiner.directives.slider',
  'wikiMiner.directives.filters',
  'wikiMiner.directives.geoMap',
  'wikiMiner.services.query_api',
  'wikiMiner.services.geo_api',
  'wikiMiner.services.nytimes_api',
  'ui.slider'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
