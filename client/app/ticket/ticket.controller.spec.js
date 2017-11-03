'use strict';

describe('Controller: ConfigCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var ConfigCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigCtrl = $controller('ConfigCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
