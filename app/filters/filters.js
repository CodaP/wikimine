angular.module('wikiMiner.directives.filters', ['wikiMiner.slider.services'])



.directive('filters', ['timeBounds', function (timeBounds) {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {
            scope.timeBounds = timeBounds;
            scope.pageList = [];
            scope.addPage = function (pageToAdd) {
                scope.pageList.push({name: pageToAdd, selected: true});
                scope.pageToAdd = "";
            };
            scope.removePage = function (indexToRemove) {
                scope.pageList.splice(indexToRemove, 1);
            },
            scope.setMinimum = function(){
                scope.timeBounds.minTime=0;
            };
            scope.setMaximum = function(){
                scope.timeBounds.maxTime=100;
            }
        },
        scope: {},
        templateUrl: 'filters/filters.html'


    }
}]);
