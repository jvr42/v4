'use strict';

describe('Controller: EditarCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var EditarCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditarCtrl = $controller('EditarCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
