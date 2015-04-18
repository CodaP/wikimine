angular.module('wikiMiner.directives.geoMap', ['uiGmapgoogle-maps'])

.directive('geoMap', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {

        },
        controller: function($scope, uiGmapGoogleMapApi) {
            // Do stuff with your $scope.
            // Note: Some of the directives require at least something to be defined originally!
            // e.g. $scope.markers = []

            // uiGmapGoogleMapApi is a promise.
            // The "then" callback function provides the google.maps object.
            $scope.map = { center: { latitude: 10, longitude: 0 }, zoom: 2 };
            uiGmapGoogleMapApi.then(function (maps) {
                // TODO: MAP SETUP
            });
        },
        scope: {},
        templateUrl: 'map/map.html'
    }
})

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDAJQyDjYwfEHZyhlOgIPKzOtFg6T87vxg',
        v: '3.17',
        libraries: 'geometry,visualization'
    });
});
