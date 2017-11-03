'use strict';

describe('Controller: ReportesCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var ReportesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReportesCtrl = $controller('ReportesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
