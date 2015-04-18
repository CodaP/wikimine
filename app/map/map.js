angular.module('wikiMiner.directives.geoMap', [])

.directive('geoMap', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {

        },
        scope: {},
        templateUrl: 'map/map.html'
    }
});
