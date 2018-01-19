'use strict';

angular.module('posApp')
  .controller('ConfigCtrl', function ($scope, Counter, $interval, Auth, $state, $http, socket) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });

    $scope.categories = [];
    $scope.category_name = '';

    $http.get('/api/categories').then(function(response){
      $scope.categories = response.data;
      socket.syncUpdates('categories', $scope.categories);
    })

    $scope.createCategory = function(){
      $http.post('/api/categories', {name: $scope.category_name});
      $scope.category_name = '';
    }

    $scope.deleteCategory = function(id){
      $http.delete('/api/categories/' + id);
    }

  	Counter.query(function(data){
  		$scope.counters = data;
  		$scope.countId = data[0]._id;
  		$scope.orden_id = data[0].orden_id;
  	});

  	$scope.updateCounter = function(callback){
  		var counter = {
  			orden_id: $scope.orden_id
  		};

  		Counter.update({id: $scope.countId}, counter);

  		return callback("Reseteado!");
  	}

  	$scope.showNotification = function(message){

  		$scope.notification = message;

		$interval(function(){
  			$scope.notification = '';
  		}, 2000);
  	}
  });
