/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

//var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

User.find({}).removeAsync()
  .then(function() {
    User.createAsync({
      provider: 'local',
      name: 'Admin',
      rut: 'admin',
      password: 'admin'
    })
    .then(function() {
      console.log('finished populating users');
    });
  });
