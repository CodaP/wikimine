'use strict';

// Declare app level module which depends on views, and components
angular.module('wikiMiner', [
  'ngRoute',
  'wikiMiner.directives.filters',
  'wikiMiner.directives.geoMap',
  'wikiMiner.services.query_api',
  'wikiMiner.services.geo_api',
  'wikiMiner.services.nytimes_api',
  'wikiMiner.controllers',
  'wikiMiner.slider.services',
  'ui.slider',
  'wikiMiner.event_plot'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
