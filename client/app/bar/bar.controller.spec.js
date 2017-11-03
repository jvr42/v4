'use strict';

describe('Controller: BarCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var BarCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BarCtrl = $controller('BarCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
