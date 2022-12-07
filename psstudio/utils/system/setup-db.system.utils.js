const {
  createDefaultUser,
} = require('../../modules/users/server/controllers/users/users.profile.server.controller');
const {
  createDefaultProjects,
} = require('../../modules/templates/server/controllers/templates.server.controller');
const {
  createDefaultDatasets,
} = require('../../modules/sample-dataset/server/controllers/datasets.server.controller');
const {
  createDefaultAlgorithms,
} = require('../../modules/algorithms/server/controllers/algorithms.server.controller');
const {
  createDefaultPlanDetails,
} = require('../../modules/manage-plans/server/controllers/manage-plans.server.controller');

/**
 * Creates the default user first then creates the default projects and datasets
 */
Promise.resolve(createDefaultUser()).then((resultsSet_1) => {
  if (resultsSet_1) {
    Promise.allSettled([
      createDefaultProjects(),
      createDefaultDatasets(),
      createDefaultAlgorithms(),
      createDefaultPlanDetails(),
    ]).then((resultsSet_2) => {
      console.log('\n------------------------------------------------------\n');
      console.log('Preliminary DB setup status \n');
      console.table([{ status: 'fulfilled', value: resultsSet_1 }, ...resultsSet_2]);
      console.log('\n------------------------------------------------------\n');
    });
  } else {
    logger.error(resultsSet_1, { Date: new Date().toString() });
  }
});
