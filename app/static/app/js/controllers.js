smytApp.controller(
  'ModelListController',
  [
    '$scope',
    '$http',
    function ($scope, $http) {
      $http.get(smyt.models_path).success(
        function(data) {
          $scope.models = data;
          for (model in data) {
            var f = function() {
              var _model = model;
              $http.get(data[_model].url).success(
                function(_data) {
                  $scope.models[_model].objects = _data;
                }
              );
            }();
          }
        }
      );
      $scope.fields_for = function (model) {
       return $scope.models[model.name].fields
      }
    }
  ]
);
