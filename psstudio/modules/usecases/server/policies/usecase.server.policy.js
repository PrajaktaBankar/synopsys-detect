/**
 * Created by neha on 22/03/2021.
 */

'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());
var jwt = require("jsonwebtoken");
var mongoose = require('mongoose'),
    Apiaccess = mongoose.model('Apiaccess');

exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['super_admin','admin','developer','report_user','pslite_user'],
        allows: [
            {
                resources: '/api/v2/usecase/report',
                permissions: ['*']
            },
            {
                resources: '/api/v2/usecase',
                permissions: ['*']
                ,
            },
            {
                resources: '/api/v2/usecase/:usecaseId',
                permissions: ['*']
            },
           
        ]
    }
    ]);
};

/**
 * Check If Strain Config Policy Allows
 */
exports.isAllowed = function (req, res, next) {

    var roles = (req.user) ? req.user.roles : ['guest'];

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
        if (err) {
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        }
        else {
            if (isAllowed) {
                // Access granted! Invoke next middleware
                return next();
            }
            else {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};