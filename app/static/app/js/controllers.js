smytApp.factory(
  'ModelsService',
  [
    '$http',
    '$rootScope',
    function ($http, $rootScope) {
      var ModelsService = {
        models: null,
        current_model: null,
        set_current_model: function (model) {
          ModelsService.current_model = model;
          $rootScope.$broadcast('current_model.update')
        },
        objects: null,
        get_objects_for: function (model) {
          $http.get(model.url).success(
            function (data) {
              ModelsService.objects = data;
              $rootScope.$broadcast('objects.update');
            }
          )
        }
      };
      $http.get(smytApp.models_path).success(
        function(data) {
          ModelsService.models = data;
          $rootScope.$broadcast('models.update');
        }
      )
      return ModelsService
    }
  ]
).controller(
  'ModelListController',
  [
    '$scope',
    '$http',
    'ModelsService',
    function ($scope, $http, ModelsService) {

      $scope.$on(
        'models.update',
        function (event) {
          $scope.models = ModelsService.models;
        }
      )

      $scope.show_objects_of = function (model) {
        ModelsService.get_objects_for(model);
        ModelsService.set_current_model(model);
      }
    }
  ]
).controller(
  'ObjectsController',
  [
    '$scope',
    '$http',
    'ModelsService',
    function ($scope, $http, ModelsService) {

      $scope.objects = ModelsService.objects;
      $scope.$on(
        'objects.update',
        function (event) {
          $scope.objects = ModelsService.objects;
        }
      );

      $scope.current_model = ModelsService.current_model;
      $scope.$on(
        'current_model.update',
        function (event) {
          $scope.current_model = ModelsService.current_model;
        }
      );

      $scope.fields_for = function (model) {
        return model ? ModelsService.models[model.name].fields : null
      }
    }
  ]
)
