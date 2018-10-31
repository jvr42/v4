'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var cajaCtrlStub = {
  index: 'cajaCtrl.index',
  show: 'cajaCtrl.show',
  create: 'cajaCtrl.create',
  update: 'cajaCtrl.update',
  destroy: 'cajaCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var cajaIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './caja.controller': cajaCtrlStub
});

describe('Caja API Router:', function() {

  it('should return an express router instance', function() {
    cajaIndex.should.equal(routerStub);
  });

  describe('GET /api/cajas', function() {

    it('should route to caja.controller.index', function() {
      routerStub.get
        .withArgs('/', 'cajaCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/cajas/:id', function() {

    it('should route to caja.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'cajaCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/cajas', function() {

    it('should route to caja.controller.create', function() {
      routerStub.post
        .withArgs('/', 'cajaCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/cajas/:id', function() {

    it('should route to caja.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'cajaCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/cajas/:id', function() {

    it('should route to caja.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'cajaCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/cajas/:id', function() {

    it('should route to caja.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'cajaCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
