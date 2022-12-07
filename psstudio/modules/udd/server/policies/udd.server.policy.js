/**
 * Created by vishnu on 22/11/18.
 */

'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());
var jwt = require("jsonwebtoken");

exports.invokeRolesPolicies = function () {
    acl.allow([
        {
            roles: ['admin', 'report_user', 'developer', 'super_admin','pslite_user'],
            allows: [{
                resources: '/api/udd',
                permissions: ['*']
            },
            {
                resources: '/api/udd/:uddId',
                permissions: ['*']
            },
            {
                resources: '/api/project/:projectId/udd/:uddId/execute',
                permissions: ['*']
            },
            {
                resources: '/api/node-red/errorLog/:uddId',
                permissions: ['*']
            },
            ]
        }
    ]);

    exports.isAllowed = function (req, res, next) {
        var roles = (req.user) ? req.user.roles : ['guest'];

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
        })
    }
};

exports.validateToken = function (req, res, next) {
    try {
        var word = req.headers.referer;
        var urlWord = word.substr(word.lastIndexOf('/') + -4);
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