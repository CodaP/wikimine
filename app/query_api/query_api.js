/**
 * Created by codaphillips on 4/18/15.
 */
(function() {
    angular.module('wikiMiner.services.query_api', ['ngResource'])
        .factory('query_api', ['$resource', function($resource){
            return $resource('http://104.236.226.8/w/api.php', {
                action:'query',
                prop:'revisions',
                format:'json',
                rvprop:'user|ids|comment|timestamp',
                rvlimit:'100',
                titles:'@titles'
            },{
                get:{method:'GET'}
            });
        }]);
})();