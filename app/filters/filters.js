angular.module('wikiMiner.directives.filters', [])



.directive('filters', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {

            scope.pageList = [];
            scope.addPage=function(pageToAdd){
                scope.pageList.push({name: pageToAdd, selected: true});
                scope.pageToAdd="";
            };
            scope.removePage=function(indexToRemove){
                scope.pageList.splice(indexToRemove,1);
            }
            scope.addRegion = function(){

            }
        },
        scope: {},
        templateUrl: 'filters/filters.html'



    }
});
