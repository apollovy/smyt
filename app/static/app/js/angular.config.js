var smytApp = angular.module('smytApp', ['ngResource'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('{$');
  $interpolateProvider.endSymbol('$}');
});
