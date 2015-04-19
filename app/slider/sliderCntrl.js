/**
 * Created by codaphillips on 4/18/15.
 */
angular.module('wikiMiner.controllers',['wikiMiner.slider.services']).
    controller('sliderCntrl', ['$scope', 'timeBounds', 'pageData', 'scale', function($scope, timeBounds, pageData, scale){
        $scope.bounds = timeBounds;
        $scope.page_data = pageData;
        $scope.scale = [0,(new Date()).valueOf()];
        $scope.$watch('page_data.query.pages', function(newValue){
            var min_time = 1e90;
            var max_time = 0;
            for(var page in newValue){
                if(newValue.hasOwnProperty(page)){
                    newValue[page].revisions.sort(function(a,b){return a.timestamp.localeCompare(b.timestamp)});
                    var possible_min_time = (new Date(newValue[page].revisions[0].timestamp)).valueOf();
                    var possible_max_time = (new Date(newValue[page].revisions.slice(-1)[0].timestamp)).valueOf();
                    if(min_time > possible_min_time){
                        min_time = possible_min_time;
                    }
                    if(max_time < possible_max_time){
                        max_time = possible_max_time;
                    }
                }
            }
            scale.minDate = min_time;
            scale.maxDate = max_time;
        });
    }]);