'use strict';

describe('Service: Producto', function () {

  // load the service's module
  beforeEach(module('posApp'));

  // instantiate service
  var Producto;
  beforeEach(inject(function (_Producto_) {
    Producto = _Producto_;
  }));

  it('should do something', function () {
    expect(!!Producto).toBe(true);
  });

});
