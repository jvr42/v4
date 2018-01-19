'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var categoriesCtrlStub = {
  index: 'categoriesCtrl.index',
  show: 'categoriesCtrl.show',
  create: 'categoriesCtrl.create',
  update: 'categoriesCtrl.update',
  destroy: 'categoriesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var categoriesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './categories.controller': categoriesCtrlStub
});

describe('Categories API Router:', function() {

  it('should return an express router instance', function() {
    categoriesIndex.should.equal(routerStub);
  });

  describe('GET /api/categories', function() {

    it('should route to categories.controller.index', function() {
      routerStub.get
        .withArgs('/', 'categoriesCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/categories/:id', function() {

    it('should route to categories.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'categoriesCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/categories', function() {

    it('should route to categories.controller.create', function() {
      routerStub.post
        .withArgs('/', 'categoriesCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/categories/:id', function() {

    it('should route to categories.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'categoriesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/categories/:id', function() {

    it('should route to categories.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'categoriesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/categories/:id', function() {

    it('should route to categories.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'categoriesCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
