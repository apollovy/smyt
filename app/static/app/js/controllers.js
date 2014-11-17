smytApp.factory(
  'ModelsService',
  [
    '$http',
    '$rootScope',
    '$resource',
    function ($http, $rootScope, $resource) {
      var ModelsService = {
        models: null,
        current_model: null,
        set_current_model: function (model) {
          ModelsService.current_model = model;
          $rootScope.$broadcast('current_model.update')
        },
        objects: null,
        get_objects_for: function (model) {
          model.__class__.query().$promise.then(
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
          for (model_name in data) {
            ModelsService.models[model_name].__class__ = $resource(
              data[model_name].url
            )
          }
          $rootScope.$broadcast('models.update');
        }
      );
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
