'use strict';

describe('wikiMiner.version module', function() {
  beforeEach(module('wikiMiner.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
