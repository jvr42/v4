'use strict';

angular.module('posApp')
  .service('message', function ($resource) {
    return $resource('/api/messages/:id', {
      id: '@_id',
    },
    {
      update: {
        method: 'PUT' // this method issues a PUT request
      },
  	})
  });
