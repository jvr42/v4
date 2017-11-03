'use strict';

angular.module('posApp')
  .service('Counter', function ($resource) {
    return $resource('/api/counter/:id', {
      id: '@_id'
    },
    {
      update: {
        method: 'PUT' // this method issues a PUT request
      }
    }
  );
  });
