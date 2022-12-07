/**
 * Created by vishnu on 21/03/2018.
 */

'use strict';

/**
 * Module dependencies.
 */
var dbconnController = require('../controllers/dbconn.server.controller');
var dbconnPolicy = require('../policies/dbconn.server.policy');

dbconnPolicy.invokeRolesPolicies();
module.exports = function (app) {
  // Single config routes
  app
    .route('/api/v2/dbconn')
    .all(dbconnPolicy.isAllowed)
    .get(dbconnController.list)
    .post(dbconnController.create);

  app
    .route('/api/v2/dbconn/:dbconnId')
    .all(dbconnPolicy.isAllowed)
    .get(dbconnController.findOne)
    .put(dbconnController.update)
    .delete(dbconnController.delete);

  app
    .route('/api/v2/dbconn/test/connection')
    .all(dbconnPolicy.isAllowed)
    .post(dbconnController.testConnection);

  // LIST, CREATE
  app
    .route('/api/connections/:type')
    .all(dbconnPolicy.isAllowed)
    .get(dbconnController.getList)
    .post(dbconnController.createNew);

  // DELETE
  app
    .route('/api/connections/:connId/delete/:type')
    .all(dbconnPolicy.isAllowed)
    .delete(dbconnController.deleteConnection);

  // UPDATE
  app
    .route('/api/connections/:connId/update/:type')
    .all(dbconnPolicy.isAllowed)
    .put(dbconnController.updateConnection);

  // TEST CONN
  app
    .route('/api/connections/:type/test')
    .all(dbconnPolicy.isAllowed)
    .post(dbconnController.testCreatedConnection);

  // BUCKETS
  app
    .route('/api/connections/:connId/s3/buckets')
    .all(dbconnPolicy.isAllowed)
    .get(dbconnController.getS3BucketsList);

  app.param('dbconnId', dbconnController.dbconnById);
};
