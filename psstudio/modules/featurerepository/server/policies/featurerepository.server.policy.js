'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = function ()
{
    acl.allow([{
        roles: ['admin','report_user','developer', 'super_admin','pslite_user'],
        allows: [{
            resources: '/api/projects/:projectId/feature_repo/:edaId/share_features',
            permissions: ['*']
        },{
            resources: '/api/projects/:projectId/feature_repo/share_features/share',
            permissions: ['*']
        },{
            resources: '/api/projects/:projectId/feature_repo/shared_features',
            permissions: ['*']
        },{
            resources: '/api/projects/:projectId/feature_repo/:edaId/use_shared_features/:featureId',
            permissions: ['*']
        },{
            resources: '/api/projects/:projectId/feature_repo/share_features',
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
