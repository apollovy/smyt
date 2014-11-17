var smytApp = angular.module(
  'smytApp',
  [
    'ngResource',
  ],
  function($interpolateProvider, $resourceProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
    $resourceProvider.defaults.stripTrailingSlashes = false;
});
