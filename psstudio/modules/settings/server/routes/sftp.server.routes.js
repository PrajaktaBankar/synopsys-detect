/**
 * Created by vishnu on 21/03/2018.
 */

'use strict';

/**
 * Module dependencies.
 */
var sftpController = require('../controllers/sftp.server.controller');
var sftpPolicy = require('../policies/sftp.server.policy');

sftpPolicy.invokeRolesPolicies();
module.exports = function (app) {
    // Single config routes
    app.route('/api/v2/sftp').all(sftpPolicy.isAllowed)
        .get(sftpController.list)
        .post(sftpController.create);

    app.route('/api/v2/sftp/:sftpId').all(sftpPolicy.isAllowed)
        .get(sftpController.findOne)
        .put(sftpController.update)
        .delete(sftpController.delete);

    app.route('/api/v2/sftp/test/connection').all(sftpPolicy.isAllowed)
        .post(sftpController.testConnection)

    app.route('/api/v2/sftp/folderStructure/:sftpId').all(sftpPolicy.isAllowed)
        .get(sftpController.folderStructure)


    app.param('sftpId', sftpController.dbsftpById)
};

