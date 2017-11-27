'use strict';

var app = require('../..');
var request = require('supertest');

var newMessages;

describe('Messages API:', function() {

  describe('GET /api/messages', function() {
    var messagess;

    beforeEach(function(done) {
      request(app)
        .get('/api/messages')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          messagess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      messagess.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/messages', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/messages')
        .send({
          name: 'New Messages',
          info: 'This is the brand new messages!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newMessages = res.body;
          done();
        });
    });

    it('should respond with the newly created messages', function() {
      newMessages.name.should.equal('New Messages');
      newMessages.info.should.equal('This is the brand new messages!!!');
    });

  });

  describe('GET /api/messages/:id', function() {
    var messages;

    beforeEach(function(done) {
      request(app)
        .get('/api/messages/' + newMessages._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          messages = res.body;
          done();
        });
    });

    afterEach(function() {
      messages = {};
    });

    it('should respond with the requested messages', function() {
      messages.name.should.equal('New Messages');
      messages.info.should.equal('This is the brand new messages!!!');
    });

  });

  describe('PUT /api/messages/:id', function() {
    var updatedMessages

    beforeEach(function(done) {
      request(app)
        .put('/api/messages/' + newMessages._id)
        .send({
          name: 'Updated Messages',
          info: 'This is the updated messages!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMessages = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMessages = {};
    });

    it('should respond with the updated messages', function() {
      updatedMessages.name.should.equal('Updated Messages');
      updatedMessages.info.should.equal('This is the updated messages!!!');
    });

  });

  describe('DELETE /api/messages/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/messages/' + newMessages._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when messages does not exist', function(done) {
      request(app)
        .delete('/api/messages/' + newMessages._id)
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
