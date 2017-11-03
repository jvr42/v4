'use strict';

describe('Controller: ArchivoCtrl', function () {

  // load the controller's module
  beforeEach(module('posApp'));

  var ArchivoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArchivoCtrl = $controller('ArchivoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
