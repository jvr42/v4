'use strict';

var app = require('../..');
var request = require('supertest');

var newCounter;

describe('Counter API:', function() {

  describe('GET /api/counter', function() {
    var counters;

    beforeEach(function(done) {
      request(app)
        .get('/api/counter')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          counters = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      counters.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/counter', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/counter')
        .send({
          name: 'New Counter',
          info: 'This is the brand new counter!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newCounter = res.body;
          done();
        });
    });

    it('should respond with the newly created counter', function() {
      newCounter.name.should.equal('New Counter');
      newCounter.info.should.equal('This is the brand new counter!!!');
    });

  });

  describe('GET /api/counter/:id', function() {
    var counter;

    beforeEach(function(done) {
      request(app)
        .get('/api/counter/' + newCounter._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          counter = res.body;
          done();
        });
    });

    afterEach(function() {
      counter = {};
    });

    it('should respond with the requested counter', function() {
      counter.name.should.equal('New Counter');
      counter.info.should.equal('This is the brand new counter!!!');
    });

  });

  describe('PUT /api/counter/:id', function() {
    var updatedCounter

    beforeEach(function(done) {
      request(app)
        .put('/api/counter/' + newCounter._id)
        .send({
          name: 'Updated Counter',
          info: 'This is the updated counter!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCounter = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCounter = {};
    });

    it('should respond with the updated counter', function() {
      updatedCounter.name.should.equal('Updated Counter');
      updatedCounter.info.should.equal('This is the updated counter!!!');
    });

  });

  describe('DELETE /api/counter/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/counter/' + newCounter._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when counter does not exist', function(done) {
      request(app)
        .delete('/api/counter/' + newCounter._id)
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
