/**
 * Created by phonyphonecall on 4/18/15.
 */
(function() {
    angular.module('wikiMiner.services.nytimes_api', ['ngResource'])
        .factory('nytimes_api', ['$resource', function($resource){
            return $resource('http://104.236.226.8/nytimes', {
                q:'@nytitle',
                page:'@nypage',
                'api-key':'5d7e73a5945063bcf4c9efc1f39de551:2:71882717'
            },{
                get:{method:'GET'}
            });
        }]);
})();
