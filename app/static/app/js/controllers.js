smytApp.controller(
  'ModelListController',
  [
    '$scope',
    '$http',
    function ($scope, $http) {
      $http.get(smyt.models_path).success(
        function(data) {
          $scope.models = data;
        }
      );
    }
  ]
);
