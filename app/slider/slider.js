var module = angular.module('wikiMiner.slider.services',[]);
module.factory('timeBounds', function(){
        return {
            'minTime': 0,
            'maxTime': 0
        }
    })
    .factory('pageData', function(query_api, geo_api){
        var pageData = {
            pages: [],
            locationsToRevs: {}, // {'{latitude, longitude}': {data: [{...}], location}}
            revLocations: [] // [{data: {...}, location: {latitude, longitude}}]
        };

        pageData.addPage = function(page) {
            var newPage = {
                name: page,
                selected: true
            };
            var addDataPoint = function (data, location) {
                data.hasComment = data.comment.length > 0;
                data.options = {visible: true};
                pageData.revLocations.push({data: data, location: location});
                locStr = JSON.stringify(location);
                if (!pageData.locationsToRevs[locStr]) {
                    pageData.locationsToRevs[locStr] = {id: data.revid, data: [data], location: location};
                } else {
                    pageData.locationsToRevs[locStr].data.push(data);
                }
            };
            var processRevisions = function (data) {
                // {query-continue: {revisions: {rvcontinue}}, query: {pages: {$id: {pageid, ns, title, revisions: [{revid, parentid, user, anon?, comment}]}}}}
                var pages = data.query.pages;
                if (data['query-continue'] != undefined) {
                    query_api.get({
                        titles: newPage.name,
                        rvstartid: data['query-continue'].revisions.rvcontinue
                    }, processRevisions);
                } else {
                    console.log('No more revisions!');
                }
                var isIp = function (ipStr) {
                    return ipStr.match(/^[0-9A-Fa-f:\\.]+$/);
                };
                var cleanIp = function (ipStr) {
                    return ipStr.replace('xxx', '0');
                };
                for (var id in pages) {
                    if (pages.hasOwnProperty(id)) {
                        var page = pages[id];
                        for (var c = 0; c < page.revisions.length; c++) {
                            var revData = page.revisions[c];
                            if (revData.anon !== undefined) {
                                var ip = cleanIp(revData.user);
                                if (isIp(revData.user)) {
                                    geo_api.get({query_ip: ip}, function (revData) {
                                        return function (data) {
                                            // {ip, country_code, country_name, region_code, region_name, city, zip_code, time_zone, latitude, longitude, metro_code}
                                            if (data.latitude != 0) {
                                                addDataPoint(revData, {
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
            pageData.pages.push(newPage);
            query_api.get({titles: page}, processRevisions);
        };
        return pageData;
    })
    .factory('scale', function(){
    return {
        'minDate': 0,
        'maxDate': 0
    }
});