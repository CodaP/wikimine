angular.module('wikiMiner.directives.geoMap', ['uiGmapgoogle-maps', 'wikiMiner.services.query_api'])

.directive('geoMap', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {

        },
        controller: function($scope, uiGmapGoogleMapApi, query_api, geo_api) {
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
            $scope.revLocations = [];
            $scope.locationsToRevs = {};
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
                    var newPoints = $scope.locationsToRevs[JSON.stringify(marker.location)];
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
            $scope.addDataPoint = function(data, location) {
                data.hasComment = data.comment.length > 0;
                this.revLocations.push({data: data, location: location});
                locStr = JSON.stringify(location);
                if (!this.locationsToRevs[locStr]) {
                    this.locationsToRevs[locStr] = [data];
                } else {
                    this.locationsToRevs[locStr].push(data);
                }
            };
            $scope.processRevisions = function(data) {
                // {query-continue: {revisions: {rvcontinue}}, query: {pages: {$id: {pageid, ns, title, revisions: [{revid, parentid, user, anon?, comment}]}}}}
                var pages = data.query.pages;
                if (data['query-continue'] != undefined) {
                    query_api.get({titles: 'Perry_Kivolowitz', rvstartid: data['query-continue'].revisions.rvcontinue}, $scope.processRevisions);
                } else {
                    console.log('No more revisions!');
                }
                for(var id in pages) {
                    if (pages.hasOwnProperty(id)) {
                        var page = pages[id];
                        for (var c = 0; c < page.revisions.length; c++) {
                            var revData = page.revisions[c];
                            if (revData.anon !== undefined) {
                                var ip = $scope.cleanIp(revData.user);
                                if ($scope.isIp(revData.user)) {
                                    geo_api.get({query_ip: ip}, function (revData) {
                                        return function (data) {
                                            // {ip, country_code, country_name, region_code, region_name, city, zip_code, time_zone, latitude, longitude, metro_code}
                                            if (data.metro_code != 0) {
                                                $scope.addDataPoint(revData, {
                                                    latitude: data.latitude,
                                                    longitude: data.longitude
                                                });
                                            }
                                        }
                                    }(revData));
                                }
                            }
                        }
                    }
                }
            };
            $scope.isIp = function(ipStr) {
                return ipStr.match(/^[0-9A-Fa-f:\\.]+$/);
            };
            $scope.cleanIp = function(ipStr) {
                return ipStr.replace('xxx', '0');
            };
            query_api.get({titles: 'Perry_Kivolowitz'}, $scope.processRevisions);
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
