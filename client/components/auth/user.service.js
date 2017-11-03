'use strict';

angular.module('posApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      getByName: {
        method: 'GET',
        url: '/api/users/specific/:id'
      },      
      update: {
          method: 'PUT' // this method issues a PUT request
      }   
    });
  });
