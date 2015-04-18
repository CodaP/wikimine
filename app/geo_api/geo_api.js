/**
 * Created by phonyphonecall on 4/18/15.
 */
(function() {
    angular.module('wikiMiner.services.geo_api', ['ngResource'])
        .factory('geo_api', ['$resource', function($resource){
            return $resource('http://104.236.226.8/geolocation/:query_ip', {
                query_ip:'@query_ip',
            },{
                get:{method:'GET'}
            });
        }]);
})();
