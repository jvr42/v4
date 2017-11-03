'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var ordenesCtrlStub = {
  index: 'ordenesCtrl.index',
  show: 'ordenesCtrl.show',
  create: 'ordenesCtrl.create',
  update: 'ordenesCtrl.update',
  destroy: 'ordenesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var ordenesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './ordenes.controller': ordenesCtrlStub
});

describe('Ordenes API Router:', function() {

  it('should return an express router instance', function() {
    ordenesIndex.should.equal(routerStub);
  });

  describe('GET /api/ordenes', function() {

    it('should route to ordenes.controller.index', function() {
      routerStub.get
        .withArgs('/', 'ordenesCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/ordenes/:id', function() {

    it('should route to ordenes.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'ordenesCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/ordenes', function() {

    it('should route to ordenes.controller.create', function() {
      routerStub.post
        .withArgs('/', 'ordenesCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/ordenes/:id', function() {

    it('should route to ordenes.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'ordenesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/ordenes/:id', function() {

    it('should route to ordenes.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'ordenesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/ordenes/:id', function() {

    it('should route to ordenes.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'ordenesCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
