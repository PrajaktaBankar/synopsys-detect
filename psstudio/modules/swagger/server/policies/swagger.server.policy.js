/**
 * Created by Saket on 17/10/17.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());
var jwt = require("jsonwebtoken");


exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin', 'report_user', 'developer', 'super_admin','pslite_user'],
        allows: [{
            resources: '/api/swagger/signin',
            permissions: ['*']
        },
        {
            resources: '/api/swagger/outputlist',
            permissions: ['*']
        }
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
            res.send('Please send token');
        }
    } catch (e) {
        res.send('Invalid Details');
    };
};
