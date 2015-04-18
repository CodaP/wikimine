var sliderApp = angular.module('wikiMiner.directives.slider',[]);

sliderApp.directive('timeSlider', function(){
        return {
            restrict:'E',
            link: function(scope,element, atttributes ){
                var beginTime;
                var endTime;
                var currentDate;
                var createdDate;
                var revisions;
            },
            scope:{

            },
            templateUrl:'slider/sliderview.html'


        }
    });

sliderApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/sliderview'});
}]);