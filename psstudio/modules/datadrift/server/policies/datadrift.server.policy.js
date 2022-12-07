/**
 * Created by Saket on 17/10/17.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = function ()
{
    acl.allow([{
        roles: ['admin','report_user','developer', 'super_admin','pslite_user'],
        allows: [{
            resources: '/api/v2/projects/:projectId/datadrift/list',
            permissions: ['*']
        },{
            resources: '/api/v2/projects/:projectId/driftConfig',
            permissions: ['*']
        },{
            resources: '/api/v2/projects/:projectId/datadrift/:driftReportId',
            permissions: ['*']
        },{
            resources: '/api/v2/training/:trainingId/models/:modelId/datadrift/start',
            permissions: ['*']
        },{
            resources: '/api/v2/projects/:projectId/config',
            permissions: ['*']
        },{
            resources: '/api/v2/projects/:projectId/delete/:configId',
            permissions: ['*']
        },{
            resources: '/api/v2/projects/:projectId/update/:configId',
            permissions: ['*']
        }]
    }
    ]);
};

/**
 * Check If Strain Config Policy Allows
 */
exports.isAllowed = function (req, res, next)
{

    var roles = (req.user) ? req.user.roles : ['guest'];

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed)
    {
        if (err)
        {
            // An authorization error occurred.
            return res.status(500).send('Unexpected authorization error');
        }
        else
        {
            if (isAllowed)
            {
                // Access granted! Invoke next middleware
                return next();
            }
            else
            {
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
