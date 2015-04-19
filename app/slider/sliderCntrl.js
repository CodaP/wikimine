/**
 * Created by codaphillips on 4/18/15.
 */
angular.module('wikiMiner.controllers',['wikiMiner.slider.services']).
    controller('sliderCntrl', ['$scope', 'timeBounds', 'pageData', 'scale', function($scope, timeBounds, pageData, scale){
        $scope.bounds = timeBounds;
        $scope.page_data = pageData;
        $scope.scale = scale;
        scale.minDate = 0;
        scale.maxDate = (new Date()).valueOf();
        $scope.$watch('page_data.revLocations', function(newValue){
                var min_time = 1e90;
                var max_time = 0;
                if(newValue.length != 0) {
                    newValue.sort(function (a, b) {
                        return a.data.timestamp.localeCompare(b.data.timestamp)
                    });
                    scale.minDate = (new Date(newValue[0].data.timestamp)).valueOf();
                    scale.maxDate = (new Date(newValue.slice(-1)[0].data.timestamp)).valueOf();
                }
        },true);

    }]);