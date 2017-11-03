'use strict';

var app = require('../..');
var request = require('supertest');

var newOrdenes;

describe('Ordenes API:', function() {

  describe('GET /api/ordenes', function() {
    var ordeness;

    beforeEach(function(done) {
      request(app)
        .get('/api/ordenes')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          ordeness = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      ordeness.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/ordenes', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/ordenes')
        .send({
          name: 'New Ordenes',
          info: 'This is the brand new ordenes!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newOrdenes = res.body;
          done();
        });
    });

    it('should respond with the newly created ordenes', function() {
      newOrdenes.name.should.equal('New Ordenes');
      newOrdenes.info.should.equal('This is the brand new ordenes!!!');
    });

  });

  describe('GET /api/ordenes/:id', function() {
    var ordenes;

    beforeEach(function(done) {
      request(app)
        .get('/api/ordenes/' + newOrdenes._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          ordenes = res.body;
          done();
        });
    });

    afterEach(function() {
      ordenes = {};
    });

    it('should respond with the requested ordenes', function() {
      ordenes.name.should.equal('New Ordenes');
      ordenes.info.should.equal('This is the brand new ordenes!!!');
    });

  });

  describe('PUT /api/ordenes/:id', function() {
    var updatedOrdenes

    beforeEach(function(done) {
      request(app)
        .put('/api/ordenes/' + newOrdenes._id)
        .send({
          name: 'Updated Ordenes',
          info: 'This is the updated ordenes!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedOrdenes = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedOrdenes = {};
    });

    it('should respond with the updated ordenes', function() {
      updatedOrdenes.name.should.equal('Updated Ordenes');
      updatedOrdenes.info.should.equal('This is the updated ordenes!!!');
    });

  });

  describe('DELETE /api/ordenes/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/ordenes/' + newOrdenes._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when ordenes does not exist', function(done) {
      request(app)
        .delete('/api/ordenes/' + newOrdenes._id)
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
