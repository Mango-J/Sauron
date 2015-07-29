'use strict';

angular.module('Sauron.version', [
  'Sauron.version.interpolate-filter',
  'Sauron.version.version-directive'
])

.value('version', '0.1');
