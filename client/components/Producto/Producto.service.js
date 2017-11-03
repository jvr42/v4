'use strict';

angular.module('posApp')
  .service('Producto', function ($resource) {
    return $resource('/api/productos/:id', {
      id: '@_id'
    },
    {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
});
