/**
 * Created by Saket on 17/10/17.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());
var jwt = require("jsonwebtoken");

exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin', 'report_user', 'developer', 'super_admin', 'pslite_user', 's_admin', 's_developer'],
        allows: [{
            resources: '/api/projects',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/data',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/data/read',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/merge',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/data/pull',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/export',
            permissions: ['*']
        }, {
            resources: '/api/project/import',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/discuss/:messageId',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/download',
            permissions: ['*']
        },
        {
            resources: '/api/project/licenseInfo',
            permissions: ['super_admin']
        },
        {
            resources: '/api/projects/:projectId/share',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/discuss',
            permissions: ['*']
        }, {
            resources: '/api/v2/project/projectCount',
            permissions: ['*']
        }]
    },
        // {
        //     roles:['admin', 'report_user', 'developer', 'super_admin'],
        //     allows:[
        //         {
        //             resources: '/api/projects/:projectId/share',
        //             permissions: ['*']
        //         }, {
        //             resources: '/api/projects/:projectId/discuss',
        //             permissions: ['*']
        //         }
        //     ]
        // }
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


exports.validateToken = function (req, res, next) {
    try {
        var word = req.headers.referer;
        var urlWord = word ? word.substr(word.lastIndexOf('/') + -4) : null;
        if (req.headers.auth) {
            var tokenDecryptInfo = jwt.verify(req.headers.auth, 'M%Z8XJQv,&Mh4#SF');

            if (tokenDecryptInfo.data) {
                res.locals.tokenInfo = tokenDecryptInfo.data;
                var token = jwt.sign(
                    {
                        data: tokenDecryptInfo.data
                    },
                    'M%Z8XJQv,&Mh4#SF',
                    {
                        expiresIn: 20 * 60
                    }
                );

                res.header("auth", token);
                next();
            } else {
                res.send('Token Expire');
            }
        } else {
            if (urlWord == 'docs/') {
                res.send('Please send token');
            } else {
                next();
            }
        }
    } catch (e) {
        res.send('Invalid Details');
    };
};
