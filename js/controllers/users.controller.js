(function () {
  'use strict';
    
  angular.module('application').filter('capitalize', function () {
    return function (input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
  });

  angular.module('application').controller('UsersController', UsersController);

  function UsersController($http, GeolocationService, $scope, $mdDialog) {
    var vm = this;

    activate();

    function activate() {
      $http.get('https://jsonplaceholder.typicode.com/users').then(resolve, reject);

      function resolve(response) {
        var users = angular.copy(response.data);
        var distances = {};
        navigator.geolocation.getCurrentPosition(function (position) {
          let clientLat = position.coords.latitude;
          let clientLng = position.coords.longitude;
          for (let i = 0; i < users.length; i++) {
            let userLat = users[i].address.geo.lat;
            let userLng = users[i].address.geo.lng;
            distances[users[i].id] = GeolocationService.getDistanceFromLatLonInKm(clientLat, clientLng, userLat, userLng);
          }
        });
        vm.distances = distances;
        vm.users = users;
        //shit code
        setTimeout(function () {
          $scope.$apply();
        }, 500);
      }

      function reject(error) {
        console.log('unlucky');
      }

      vm.searchOptions = [
            'name', 'username', 'email'
      ];

      vm.sortOptions = [
            'name', 'username', 'email', 'company.name', 'address.street'
      ];

      vm.sortMode = true;

      vm.sortingField = 'name';
    }

    vm.addUser = function (ev) {
      $mdDialog.show({
        controller: AddUserController,
        templateUrl: './templates/add-user.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: true
      }).then(resolve, reject);

      function resolve() {
        // body...
      }

      function reject() {
        // body...
      }

      function AddUserController($scope, $mdDialog) {
        $scope.test = 'test';

        $scope.cancel = function () {
          console.log($scope);
          //$mdDialog.cancel();
        };
      }
    };

    vm.sort = function () {
      return (vm.sortMode == false) ? '-' + vm.sortingField : vm.sortingField;
    };

    vm.filterItems = function (user) {
      if (typeof vm.searchFilter == 'undefined' || typeof vm.selectedSearchOption == 'undefined' || vm.searchFilter == '') {
        return false;
      } else {
        return (user[vm.selectedSearchOption] == vm.searchFilter) ? false : true;
      }
    };
  }
})();
