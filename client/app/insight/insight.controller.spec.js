'use strict';

describe('Controller: InsightCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var InsightCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InsightCtrl = $controller('InsightCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
