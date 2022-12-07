/**
 * Created by winjitian on 23/07/2020.
 */

'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());
var jwt = require("jsonwebtoken");
var mongoose = require('mongoose'),
    Apiaccess = mongoose.model('Apiaccess');

exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin', 'report_user', 'developer', 'super_admin','pslite_user'],
        allows: [{
            resources: '/api/v2/projects/:projectId/output',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/shareOutput',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/shareOutput/:shareOutputId',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/shareOutput/list',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/shareOutput/byUser',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/output/data/reportpreview',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/output/:outputId/preview',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/output/:outputId',
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

exports.checkCount = function (req, res, next) {
    try {
        var word = req.headers.referer;
        var urlWord = word.substr(word.lastIndexOf('/') + -4);
        var queryObj = { user_id: res.locals.tokenInfo._id };
        if (urlWord == 'docs/') {

            Apiaccess.find(queryObj, function (err, docs) {
                if (err) {
                    res.status(400).send({ message: 'Could not fetch details!', err: err });
                }
                if (docs[0].apis[0].apiName == 'get output') {
                    if (docs[0].apis[0].consumed != docs[0].apis[0].countDocuments) {
                        docs[0].apis[0].consumed = docs[0].apis[0].consumed + 1;
                        docs[0].markModified('apis');
                        docs[0].save(function (err) {
                        });
                        next();
                    } else {
                        res.send('API limit exceeded');
                    }
                }
            })
        } else {
            next();
        }
    } catch (e) {
        // res.send('Invalid Details');
        next();
    };
};

exports.validateToken = function (req, res, next) {
    try {
        var word = req.headers.referer;
        var urlWord = word.substr(word.lastIndexOf('/') + -4);
        if (req.headers.auth && urlWord == 'docs/') {
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