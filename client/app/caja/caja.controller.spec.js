'use strict';

describe('Controller: CajaCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var CajaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CajaCtrl = $controller('CajaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
