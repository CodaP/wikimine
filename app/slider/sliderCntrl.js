/**
 * Created by codaphillips on 4/18/15.
 */
angular.module('wikiMiner.controllers',['wikiMiner.slider.services']).
    controller('sliderCntrl', ['$scope', 'timeBounds', function($scope, timeBounds){
        $scope.bounds = timeBounds;
    }]);