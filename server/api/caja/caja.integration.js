'use strict';

var app = require('../..');
var request = require('supertest');

var newCaja;

describe('Caja API:', function() {

  describe('GET /api/cajas', function() {
    var cajas;

    beforeEach(function(done) {
      request(app)
        .get('/api/cajas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          cajas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      cajas.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/cajas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/cajas')
        .send({
          name: 'New Caja',
          info: 'This is the brand new caja!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newCaja = res.body;
          done();
        });
    });

    it('should respond with the newly created caja', function() {
      newCaja.name.should.equal('New Caja');
      newCaja.info.should.equal('This is the brand new caja!!!');
    });

  });

  describe('GET /api/cajas/:id', function() {
    var caja;

    beforeEach(function(done) {
      request(app)
        .get('/api/cajas/' + newCaja._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          caja = res.body;
          done();
        });
    });

    afterEach(function() {
      caja = {};
    });

    it('should respond with the requested caja', function() {
      caja.name.should.equal('New Caja');
      caja.info.should.equal('This is the brand new caja!!!');
    });

  });

  describe('PUT /api/cajas/:id', function() {
    var updatedCaja

    beforeEach(function(done) {
      request(app)
        .put('/api/cajas/' + newCaja._id)
        .send({
          name: 'Updated Caja',
          info: 'This is the updated caja!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCaja = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCaja = {};
    });

    it('should respond with the updated caja', function() {
      updatedCaja.name.should.equal('Updated Caja');
      updatedCaja.info.should.equal('This is the updated caja!!!');
    });

  });

  describe('DELETE /api/cajas/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/cajas/' + newCaja._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when caja does not exist', function(done) {
      request(app)
        .delete('/api/cajas/' + newCaja._id)
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
