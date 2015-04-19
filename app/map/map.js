angular.module('wikiMiner.directives.geoMap', ['uiGmapgoogle-maps', 'wikiMiner.services.query_api'])

.directive('geoMap', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {

        },
        controller: function($scope, uiGmapGoogleMapApi, pageData) {
            // Do stuff with your $scope.
            // Note: Some of the directives require at least something to be defined originally!
            // e.g. $scope.markers = []

            // uiGmapGoogleMapApi is a promise.
            // The "then" callback function provides the google.maps object.
            $scope.map = {
                center: { latitude: 23, longitude: -90 },
                zoom: 4,
                options: {
                    backgroundColor: "#000000",
                    mapTypeControl: false,
                    maxZoom: 14, // don't let people zoom to street level, since GeoIP is not reliable at that level
                    streetViewControl: false,
                    styles: [] // TODO: add styles
                }
            };
            $scope.pageData = pageData;
            $scope.expandLocations = [];
            $scope.expandLines = [];
            $scope.selectedLocation = null;
            $scope.selectMarker = function(marker) {
                if (marker === $scope.selectedLocation) {
                    $scope.selectedLocation = null;
                    $scope.expandLocations.length = 0;
                    $scope.expandLines.length = 0;
                } else {
                    $scope.selectedLocation = marker;
                    $scope.expandLocations.length = 0;
                    $scope.expandLines.length = 0;
                    var newPoints = pageData.locationsToRevs[JSON.stringify(marker.location)];
                    var circumference = newPoints.length * 0.01;
                    var radius = circumference / (2*Math.PI);
                    for (var c = 0; c < newPoints.length; c++) {
                        var pointLocation = {
                            latitude: marker.location.latitude + radius * Math.cos(2 * Math.PI * c / newPoints.length),
                            longitude: marker.location.longitude + radius * Math.sin(2 * Math.PI * c / newPoints.length)
                        };
                        $scope.expandLocations.push({
                            data: newPoints[c],
                            location: pointLocation});
                        $scope.expandLines.push([pointLocation, marker.location]);
                    }
                }
            };
            uiGmapGoogleMapApi.then(function (maps) {

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
