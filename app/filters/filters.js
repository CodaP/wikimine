angular.module('wikiMiner.directives.filters', ['wikiMiner.slider.services', 'wikiMiner.services.page_title_api'])


.directive('filters', ['timeBounds','scale', 'pageData', 'page_title_api', function (timeBounds, scale, pageData, page_title_api) {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {
            scope.timeBounds = timeBounds;
            scope.scale=scale;
            scope.pageData = pageData;

            scope.$watch('timeBounds',function(newValues){
                scope.maxDate = new Date((scale.maxDate-scale.minDate)*(timeBounds.maxTime/100)+scale.minDate);
                scope.minDate = new Date((scale.maxDate-scale.minDate)*(timeBounds.minTime/100)+scale.minDate);
                // timeBounds.maxTime = ((scope.maxDate)/(scale.maxDate))*100;

                 //timeBounds.minTime = ((scope.minDate)/(scale.maxDate))*100;
                //alert(timeBounds.minTime + " "+ timeBounds.maxTime);

            }, true);

            scope.addPage = function (pageToAdd) {
                scope.pageData.addPage(pageToAdd);
                scope.pageToAdd = "";
            };
            scope.removePage = function (indexToRemove) {
                //TODO
                scope.pageList.splice(indexToRemove, 1);
            };
            scope.setMinimum = function(){
                scope.minDate=new Date(scale.minDate);
                scope.updateTime();
                //timeBounds.minTime = ((scope.minDate)/(scale.maxDate))*100;
            };
            scope.setMaximum = function(){
                scope.maxDate=new Date(scale.maxDate);
                scope.updateTime();
                //timeBounds.maxTime = ((scope.maxDate)/(scale.maxDate))*100;
            };

            scope.suggestions = [];
            scope.updateSuggestions = function(data) {
                console.log("updating suggestions with: " + JSON.stringify(data.query.allpages));
                scope.suggestions = [];
                for (var i = 0; i < data.query.allpages.length; i++) {
                    scope.suggestions.push(data.query.allpages[i].title);
                }
            };

            scope.triggerUpdateSuggestions = function(typed) {
                console.log("triggering update: " + JSON.stringify(typed));
                page_title_api.get({'apprefix':typed}, scope.updateSuggestions); 
            };
            scope.updateTime = function(){ //updates the timeBounds info, effectively the second watch function

                //timeBounds.maxTime = ((scope.maxDate-scale.minDate)/(scale.maxDate))*100;
                //timeBounds.minTime = ((scope.minDate-scale.minDate)/(scale.maxDate))*100;
            }
        },
        scope: {},
        templateUrl: 'filters/filters.html'


    }
}]);
