angular.module('wikiMiner.directives.filters', ['wikiMiner.slider.services'])



.directive('filters', ['timeBounds','scale', function (timeBounds,scale) {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {
            scope.timeBounds = timeBounds;
            scope.scale=scale;
            scope.pageList = [];
            scope.$watch('timeBounds',function(newValue){
                scope.maxDate = new Date((scale.maxDate-scale.minDate)*(timeBounds.maxTime/100)+scale.minDate);
                scope.minDate = new Date((scale.maxDate-scale.minDate)*(timeBounds.minTime/100)+scale.minDate);
            }, true);
            scope.addPage = function (pageToAdd) {
                scope.pageList.push({name: pageToAdd, selected: true});
                scope.pageToAdd = "";
            };
            scope.removePage = function (indexToRemove) {
                scope.pageList.splice(indexToRemove, 1);
            },
            scope.setMinimum = function(){

            };
            scope.setMaximum = function(){
                
            }
        },
        scope: {},
        templateUrl: 'filters/filters.html'


    }
}]);
