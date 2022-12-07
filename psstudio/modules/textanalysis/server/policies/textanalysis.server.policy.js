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
            resources: '/api/projects/:projectId/notebooks',
            permissions: ['*']
        },
        {
            resources: '/api/projects/:projectId/notebook/save',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/wordFrequency',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/textCleaning',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/pos',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/ner',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/textSummarization',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/sentimentAnalysis',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/wordEmbedding',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/textAnalysis/experiments',
            permissions: ['*']
        },
        {
            resources: '/api/v2/projects/:projectId/textAnalysis/feature',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/saveAnalysis',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/apply/saveAnalysis',
            permissions: ['*']
        },
        {
            resources: '/api/v2/textAnalysis/ruleBasedMatch',
            permissions: ['*']
        },
    ]
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
