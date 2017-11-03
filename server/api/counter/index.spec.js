'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var counterCtrlStub = {
  index: 'counterCtrl.index',
  show: 'counterCtrl.show',
  create: 'counterCtrl.create',
  update: 'counterCtrl.update',
  destroy: 'counterCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var counterIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './counter.controller': counterCtrlStub
});

describe('Counter API Router:', function() {

  it('should return an express router instance', function() {
    counterIndex.should.equal(routerStub);
  });

  describe('GET /api/counter', function() {

    it('should route to counter.controller.index', function() {
      routerStub.get
        .withArgs('/', 'counterCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/counter/:id', function() {

    it('should route to counter.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'counterCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/counter', function() {

    it('should route to counter.controller.create', function() {
      routerStub.post
        .withArgs('/', 'counterCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/counter/:id', function() {

    it('should route to counter.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'counterCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/counter/:id', function() {

    it('should route to counter.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'counterCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/counter/:id', function() {

    it('should route to counter.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'counterCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
