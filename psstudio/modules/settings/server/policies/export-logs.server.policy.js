/**
 * Created by vishnu on 21/03/2018.
 */
'use strict';

var acl = require('acl');
var path = require('path'),
    logger = require(path.resolve('./logger'));

acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = function ()
{
    acl.allow([
        {
            roles: ['admin','developer', 'super_admin'],
            allows: [{
                resources: '/api/export-logs',
                permissions: ['post']
            },
                {
                    resources: '/api/export-route-logs',
                    permissions: ['get']
                },
                {
                    resources: '/api/export-os-logs',
                    permissions: ['post']
                },
                {
                    resources: '/api/export-logs/repair',
                    permissions: ['get']
                },
                {
                    resources: '/api/export-pscore-app-logs/:pscoreConfigId',
                    permissions: ['get']
                }]
        }
    ]);

    exports.isAllowed = function (req, res, next)
    {
        var roles = (req.user) ? req.user.roles : ['guest'];


        acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed)
        {
            if (err)
            {
                // An authorization error occurred.
                logger.error('Unexpected authorization error', {error: err});
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
                    logger.warn('Unauthorized user tried to export logs', (req.user ? req.user : ''), req.ip);
                    return res.status(403).json({
                        message: 'User is not authorized'
                    });
                }
            }
        })
    }
};
