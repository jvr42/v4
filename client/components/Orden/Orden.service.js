
'use strict';

angular.module('posApp')
  .service('Orden', function ($resource) {
    return $resource('/api/ordenes/:id', {
      id: '@_id',
      desde: '@desde',
      hasta: '@hasta'
    },
    {
      update: {
        method: 'PUT' // this method issues a PUT request
      },
      getAll: {
        method: 'GET', // this method issues a PUT request
        url: '/api/ordenes/all',
        isArray: true
      },
      getOrdenesByRange: {
        method: 'GET', // this method issues a PUT request
        url: '/api/ordenes/:desde/:hasta',
        isArray: true
      },
      getProductosVendidos: {
        method: 'GET', // this method issues a PUT request
        url: '/api/ordenes/productos/:desde/:hasta',
        isArray: true
      },
      getAmmountSales: {
        method: 'GET', // this method issues a PUT request
        url: '/api/ordenes/ventas/:desde/:hasta',
        isArray: true
      },
      getOrden: {
        method: 'GET', // this method issues a PUT request
        url: '/api/ordenes/orden/especific/:id',
        isArray: true
      }
    }
  );
  });
