/**
 * Created by Saket on 17/10/17.
 */

var swaggerController = require('../controllers/swagger.server.controller');
var swaggerPolicy = require('../policies/swagger.server.policy');

swaggerPolicy.invokeRolesPolicies();
module.exports = function (app) {

    app.route('/api/swagger/signin').all(swaggerPolicy.isAllowed)
        .post(swaggerController.signin);

    app.route('/api/swagger/projects').all(swaggerPolicy.validateToken)
        .get(swaggerController.projectlist)

    app.route('/api/swagger/outputlist').all(swaggerPolicy.validateToken)
        .get(swaggerController.reportOutputList)
        .post(swaggerController.viewShareReport)

    app.route('/api/swagger/datagroup').all(swaggerPolicy.validateToken)
        .get(swaggerController.datagroup);

    app.route('/api/swagger/filelist').all(swaggerPolicy.validateToken)
        .post(swaggerController.filelist);

};
