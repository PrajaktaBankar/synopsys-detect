/**
 * Created by Saket on 17/10/17.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());
var jwt = require("jsonwebtoken");

exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin', 'report_user', 'developer', 'super_admin','pslite_user','s_admin','s_developer'],
        allows: [{
            resources: '/api/v2/projects/:projectId/data',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/data/upload/:dataGroupId',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/data/:dataId',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/data/pull',
            permissions: ['*']
        }, {
            resources: '/api/v2/data/:dataId/report',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/data/querydb',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/data/:dataId/report',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/data/:dataId/child',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/data/merge',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/dataGroup',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/dataGroup/allData',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/dataGroup',
            permissions: ['*']
        }, ,
        {
            resources: '/api/v2/projects/:projectId/dataGroup/:dataGroupdataById',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/dataGroup/:dataId',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/dataConnection/insert',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/dataConnection',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/dataConnection/:dbconnId',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/dataConnection/:dataId',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/rawFiles',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/rawFiles/:connId',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/rawFiles/:rawDataId',
            permissions: ['*']
        },
        {
            resources: '/api/project/:projectId/udd/execute',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/deleteFile',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/deleteAllRawfiles',
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
                return next();
            }
        }
    });
};


exports.validateToken = function (req, res, next) {
    try {
        var word = req.headers.referer;
        var urlWord = word ? word.substr(word.lastIndexOf('/') + -4): null;
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