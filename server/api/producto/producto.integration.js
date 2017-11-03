'use strict';

var app = require('../..');
var request = require('supertest');

var newProducto;

describe('Producto API:', function() {

  describe('GET /api/productos', function() {
    var productos;

    beforeEach(function(done) {
      request(app)
        .get('/api/productos')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          productos = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      productos.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/productos', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/productos')
        .send({
          name: 'New Producto',
          info: 'This is the brand new producto!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newProducto = res.body;
          done();
        });
    });

    it('should respond with the newly created producto', function() {
      newProducto.name.should.equal('New Producto');
      newProducto.info.should.equal('This is the brand new producto!!!');
    });

  });

  describe('GET /api/productos/:id', function() {
    var producto;

    beforeEach(function(done) {
      request(app)
        .get('/api/productos/' + newProducto._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          producto = res.body;
          done();
        });
    });

    afterEach(function() {
      producto = {};
    });

    it('should respond with the requested producto', function() {
      producto.name.should.equal('New Producto');
      producto.info.should.equal('This is the brand new producto!!!');
    });

  });

  describe('PUT /api/productos/:id', function() {
    var updatedProducto

    beforeEach(function(done) {
      request(app)
        .put('/api/productos/' + newProducto._id)
        .send({
          name: 'Updated Producto',
          info: 'This is the updated producto!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedProducto = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedProducto = {};
    });

    it('should respond with the updated producto', function() {
      updatedProducto.name.should.equal('Updated Producto');
      updatedProducto.info.should.equal('This is the updated producto!!!');
    });

  });

  describe('DELETE /api/productos/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/productos/' + newProducto._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when producto does not exist', function(done) {
      request(app)
        .delete('/api/productos/' + newProducto._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
