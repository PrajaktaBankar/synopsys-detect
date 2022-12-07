'use strict';

var algoPolicy = require('../policies/algorithms.server.policy');
algoPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var algorithm = require('../controllers/algorithms.server.controller');

  app
    .route('/api/algorithm')
    .all(algoPolicy.isAllowed)
    .post(algorithm.createAlgorithm)
    .get(algorithm.getAllAlgos);

  app
    .route('/api/algorithm/:algoId/delete')
    .all(algoPolicy.isAllowed)
    .delete(algorithm.softDeleteAlgorithm);

  app
    .route('/api/algorithm/:algoId/status/:status')
    .all(algoPolicy.isAllowed)
    .get(algorithm.disableAlgorithm);

  app
    .route('/api/algorithm/:algoId/update')
    .all(algoPolicy.isAllowed)
    .put(algorithm.updateAlgorithm);

  // Finish by binding the user middleware
  // app.param('ticketId', algorithm.ticketById);
};
