/**
 * Created by codaphillips on 4/18/15.
 */
(function() {
    angular.module('wikiMiner.services.page_title_api', ['ngResource'])
        .factory('page_title_api', ['$resource', function($resource){
            return $resource('http://104.236.226.8/w/api.php', {
                action:'query',
                list:'allpages',
                format:'json',
                aplimit:'10',
                apprefix:'@apprefix'
            },{
                get:{method:'GET'}
            });
        }]);
})();
