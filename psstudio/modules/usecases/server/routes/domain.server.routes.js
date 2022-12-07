/**
 * Created by neha on 22/03/2021.
 */

 var domainController = require('../controllers/doamin.server.controller');
 var domainPolicy = require('../policies/domain.server.policy');
 
 domainPolicy.invokeRolesPolicies();
 module.exports = function (app) {
    app.route('/api/v2/usecase/domain').all(domainPolicy.isAllowed)
    .post(domainController.createDomain)
    .get(domainController.getDomainList)
    
    app.route('/api/v2/usecase/domain/:domainId').all(domainPolicy.isAllowed)
    .get(domainController.findOneDomain)
    .put(domainController.updateDomain)
    .delete(domainController.deleteDomain);

    app.param('domainId', domainController.dataByDomainId);
};