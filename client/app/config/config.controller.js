'use strict';

angular.module('posApp')
  .controller('ConfigCtrl', function ($scope, Counter, $interval, Auth, $state) {
    Auth.isLoggedIn(function(response){
      if (!response){
        $state.go('login');
      }
    });

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
