'use strict';

var datasetsPolicy = require('../policies/datasets.server.policy');
datasetsPolicy.invokeRolesPolicies();

module.exports = function (app) {
  var datasets = require('../controllers/datasets.server.controller');

  app
    .route('/api/sampledatasets')
    .all(datasetsPolicy.isAllowed)
    .post(datasets.createdataset)
    .get(datasets.getAlldatasets);

  app
    .route('/api/sampledatasets/:datasetId')
    .all(datasetsPolicy.isAllowed)
    .put(datasets.updatedataset)
    .delete(datasets.deletedataset);

  // Finish by binding the user middleware
  app.param('datasetId', datasets.datasetById);
};
