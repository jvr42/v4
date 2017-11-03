'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var productoCtrlStub = {
  index: 'productoCtrl.index',
  show: 'productoCtrl.show',
  create: 'productoCtrl.create',
  update: 'productoCtrl.update',
  destroy: 'productoCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productoIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './producto.controller': productoCtrlStub
});

describe('Producto API Router:', function() {

  it('should return an express router instance', function() {
    productoIndex.should.equal(routerStub);
  });

  describe('GET /api/productos', function() {

    it('should route to producto.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productoCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/productos/:id', function() {

    it('should route to producto.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productoCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/productos', function() {

    it('should route to producto.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productoCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/productos/:id', function() {

    it('should route to producto.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'productoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/productos/:id', function() {

    it('should route to producto.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'productoCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/productos/:id', function() {

    it('should route to producto.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productoCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
