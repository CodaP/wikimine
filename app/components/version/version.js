'use strict';

angular.module('wikiMiner.version', [
  'wikiMiner.version.interpolate-filter',
  'wikiMiner.version.version-directive'
])

.value('version', '0.1');
