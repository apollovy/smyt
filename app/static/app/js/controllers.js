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
        },
        input_types_mapping: {
          char: "text",
          int: "number",
          date: "date",
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
          $scope.new_object_reset();
        }
      );

      $scope.fields_for = function (model) {
        return model ? ModelsService.models[model.name].fields : null
      };

      $scope.input_types_mapping = ModelsService.input_types_mapping;

      $scope.new_object = null;
      $scope.new_object_reset = function () {
        $scope.new_object = new ModelsService.current_model.__class__;
      }
      $scope.new_object_save = function () {
        for (field in $scope.new_object) {
          if (
              $scope.current_model[field] &&
              $scope.current_model[field].type == 'date'
          ) {
            // A (very) strange case is that if you set date=2014-11-17,
            // you'll get 2014-11-16 in request - guess there's TZ issues
            // somewhere, cause it's 02:13GMT+3 and date_joined is sent
            // 2014-11-16T21:00:00.000Z
            $scope.new_object[field] = Date($scope.new_object[field]);
          }
        }
        $scope.new_object.$save(
          [], function () {
            $scope.objects.push($scope.new_object);
            $scope.new_object_reset();
          }, function (response) {
            console.log(response);
          }
        )
      }
    }
  ]
)
