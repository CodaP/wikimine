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

                    $( element ).slider({
                        range: true,
                        min: 0,
                        max: 500,
                        values: [75, 300],
                        slide: function (event, ui) {
                        //    ui.values[0]
                        //    ui.values[1]
                        }
                    });

            },
            scope:{

            },
            template:'<div></div>'


        }
    });

sliderApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/sliderview'});
}]);