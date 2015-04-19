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
                center: { latitude: 10, longitude: 0 },
                zoom: 2,
                options: {
                    backgroundColor: "#000000",
                    mapTypeControl: false,
                    maxZoom: 10, // don't let people zoom to street level, since GeoIP is not reliable at that level
                    streetViewControl: false,
                    styles: [] // TODO: add styles
                }
            };
            $scope.preData = [];
            $scope.addDataPoint = function(data, location) {
                this.preData.push({data: data, location: location});
            };
            $scope.processRevisions = function(data) {
                // {query-continue: {revisions: {rvcontinue}}, query: {pages: {$id: {pageid, ns, title, revisions: [{revid, parentid, user, anon?, comment}]}}}}
                var pages = data.query.pages;
                if (data['query-continue'] != undefined) {
                    console.log("Continue!");
                    query_api.get({titles: 'baseball', rvstartid: data['query-continue'].revisions.rvcontinue}, $scope.processRevisions);
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
            query_api.get({titles: 'baseball'}, $scope.processRevisions);
            uiGmapGoogleMapApi.then(function (maps) {
                $scope.addDataPoint = function(data, location) {
                    //TODO: show on the map
                    console.log('data: '+JSON.stringify(data)+', location: '+JSON.stringify(location));
                };
                for (var c = 0; c < $scope.preData.length; c++) {
                    $scope.addDataPoint(preData[c].data, preData[c].location);
                }
                delete $scope.preData;
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
