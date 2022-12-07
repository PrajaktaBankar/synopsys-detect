/**
 * Created by Saket on 17/10/17.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin', 'report_user', 'developer', 'super_admin', 'pslite_user', 's_admin', 's_developer'],
        allows: [{
            resources: '/api/v2/projects/:projectId/eda',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/eda/done',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/eda/feature',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/eda/edagraph',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/:edaId/edaSummary/download',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/:edaId/info',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/:edaId/outlierPreview/download',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/:edaId/imputedDataset/download',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/:edaId/adv-eda-report/download',
            permissions: ['*']
        }, {
            resources: '/api/v2/conditionalFiltering',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/targetList',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/eda/edaByFile',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/dateFormat',
            permissions: ['*']
        }, {
            resources: '/api/v2/eda/multiTimeseries',
            permissions: ['*']
        },
        {
            resources: '/api/v2/resamplingPreview',
            permissions: ['*']
        },
        {
            resources: '/api/v2/multiple/calculateFrequency',
            permissions: ['*']
        },
        {
            resources: '/api/v2/eda/timeseriesGroupList',
            permissions: ['*']
        }
        ]
    }, {
        roles: ['admin', 'report_user', 'developer', 'super_admin', 'pslite_user'],
        allows: [
            {
                resources: '/api/v2/projects/:projectId/eda/:edaId/advedainfo',
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
                return res.status(403).json({
                    message: 'User is not authorized'
                });
            }
        }
    });
};
