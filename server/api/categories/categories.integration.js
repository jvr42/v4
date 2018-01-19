'use strict';

var app = require('../..');
var request = require('supertest');

var newCategories;

describe('Categories API:', function() {

  describe('GET /api/categories', function() {
    var categoriess;

    beforeEach(function(done) {
      request(app)
        .get('/api/categories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          categoriess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      categoriess.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/categories', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/categories')
        .send({
          name: 'New Categories',
          info: 'This is the brand new categories!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newCategories = res.body;
          done();
        });
    });

    it('should respond with the newly created categories', function() {
      newCategories.name.should.equal('New Categories');
      newCategories.info.should.equal('This is the brand new categories!!!');
    });

  });

  describe('GET /api/categories/:id', function() {
    var categories;

    beforeEach(function(done) {
      request(app)
        .get('/api/categories/' + newCategories._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          categories = res.body;
          done();
        });
    });

    afterEach(function() {
      categories = {};
    });

    it('should respond with the requested categories', function() {
      categories.name.should.equal('New Categories');
      categories.info.should.equal('This is the brand new categories!!!');
    });

  });

  describe('PUT /api/categories/:id', function() {
    var updatedCategories

    beforeEach(function(done) {
      request(app)
        .put('/api/categories/' + newCategories._id)
        .send({
          name: 'Updated Categories',
          info: 'This is the updated categories!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedCategories = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedCategories = {};
    });

    it('should respond with the updated categories', function() {
      updatedCategories.name.should.equal('Updated Categories');
      updatedCategories.info.should.equal('This is the updated categories!!!');
    });

  });

  describe('DELETE /api/categories/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/categories/' + newCategories._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when categories does not exist', function(done) {
      request(app)
        .delete('/api/categories/' + newCategories._id)
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
