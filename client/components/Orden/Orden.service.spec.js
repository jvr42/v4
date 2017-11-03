'use strict';

describe('Service: Orden', function () {

  // load the service's module
  beforeEach(module('posApp'));

  // instantiate service
  var Orden;
  beforeEach(inject(function (_Orden_) {
    Orden = _Orden_;
  }));

  it('should do something', function () {
    expect(!!Orden).toBe(true);
  });

});
