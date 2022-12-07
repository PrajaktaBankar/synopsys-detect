/**
 * Created by Saket on 17/10/17.
 */

var notebookController=  require('../controllers/notebook.server.controller');
var notebookPolicy = require('../policies/notebook.server.policy');

notebookPolicy.invokeRolesPolicies();
module.exports = function (app)
{
    app.route('/api/projects/:projectId/notebooks').all(notebookPolicy.isAllowed)
        .get(notebookController.list)

    app.route('/api/projects/:projectId/notebook/save').all(notebookPolicy.isAllowed)
        .post(notebookController.create);

    app.route('/api/projects/:projectId/notebook/:notebookId/delete/:notebookName').all(notebookPolicy.isAllowed)
        .delete(notebookController.deleteNotebook);
        
};
