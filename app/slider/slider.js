var module = angular.module('wikiMiner.slider.services',[]);
module.factory('timeBounds', function(){
        return {
            'minTime': 0,
            'maxTime': 100
        }
    })
    .factory('pageData', function(query_api, geo_api){
        var pageData = {
            pages: [],
            locations: [],
            locationsToRevs: {}, // {'{latitude, longitude}': {data: [{...}], location}}
            revLocations: [] // [{data: {...}, location: {latitude, longitude}}]
        };

        pageData.removePage = function(index) {
            var page = pageData.pages.splice(index, 1)[0];
            page.revLocations.forEach(function(data) {
                for (var c = 0; c < pageData.locations.length; c++) {
                    var test = pageData.locations[c];
                    if (angular.equals(test.location, data.location)) {
                        for (var d = 0; d < test.data.length; d++) {
                            var testEl = test.data[d];
                            if (testEl == data.data) {
                                test.data.splice(d, 1);
                                if (test.data.length == 0) {
                                    pageData.locations.splice(c, 1);
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
                for (var c = 0; c < pageData.revLocations.length; c++) {
                    if (pageData.revLocations[c].data == data.data) {
                        pageData.revLocations.splice(c, 1);
                        break;
                    }
                }
                var locKey = JSON.stringify(data.location);
                var datas = pageData.locationsToRevs[locKey].data;
                for (var c = 0; c < datas.length; c++) {
                    if (datas[c] == data.data) {
                        datas.splice(c, 1);
                        if (datas.length == 0) {
                            delete pageData.locationsToRevs[locKey];
                        }
                        break;
                    }
                }
            });
        };

        pageData.addPage = function(page) {
            var newPage = {
                name: page,
                selected: true,
                revLocations: [],
                loadRemain: 15,
                loadLimitHit: false,
                loadFinished: false
            };
            var addDataPoint = function (data, location) {
                data.hasComment = data.comment.length > 0;
                data.options = {visible: true};
                pageData.revLocations.push({data: data, location: location});
                newPage.revLocations.push({data: data, location: location});
                locStr = JSON.stringify(location);
                if (!pageData.locationsToRevs[locStr]) {
                    var newData = {options: {visible: true}, id: data.revid, data: [data], location: location};
                    newData.select = function() {
                        window.$mapScope.selectLocation(newData);
                    };
                    pageData.locationsToRevs[locStr] = newData;
                    pageData.locations.push(newData)
                } else {
                    pageData.locationsToRevs[locStr].data.push(data);
                }
            };
            var processRevisions = function (data) {
                // {query-continue: {revisions: {rvcontinue}}, query: {pages: {$id: {pageid, ns, title, revisions: [{revid, parentid, user, anon?, comment}]}}}}
                var pages = data.query.pages;
                if (data['query-continue'] != undefined) {
                    newPage.loadRemain--;
                    if (newPage.loadRemain == 0) {
                        newPage.loadLimitHit = true;
                    } else {
                        query_api.get({
                            titles: newPage.name,
                            rvstartid: data['query-continue'].revisions.rvcontinue
                        }, processRevisions);
                    }
                } else {
                    console.log('No more revisions!');
                    newPage.loadRemain = 0;
                    newPage.loadLimitHit = false;
                    newPage.loadFinished = true;
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
            newPage.continueLoad = function() {
                if (!newPage.loadLimitHit || newPage.loadFinished) {
                    console.log('Page not ready to continue load');
                    return;
                }
                newPage.loadLimitHit = false;
                newPage.loadRemain = 15;
                query_api.get({titles: page}, processRevisions);
            };
            pageData.pages.push(newPage);
            query_api.get({titles: page}, processRevisions);
        };
        pageData.continueLoad = function(index) {
            pageData.pages[index].continueLoad();
        };
        return pageData;
    })
    .factory('scale', function(){
    return {
        'minDate': 0,
        'maxDate': 0
    }
});