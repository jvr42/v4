'use strict';

describe('Controller: CocinaCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var CocinaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CocinaCtrl = $controller('CocinaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
