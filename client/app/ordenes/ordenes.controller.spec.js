'use strict';

describe('Controller: OrdenesCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var OrdenesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OrdenesCtrl = $controller('OrdenesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
