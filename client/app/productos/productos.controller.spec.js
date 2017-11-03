'use strict';

describe('Controller: ProductosCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var ProductosCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProductosCtrl = $controller('ProductosCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
