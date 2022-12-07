/**
 * Created by Saket on 17/10/17.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());


exports.invokeRolesPolicies = function ()
{
    acl.allow([{
        roles: ['admin','report_user','developer', 'super_admin','pslite_user','s_admin','s_developer'],
        allows: [{
            resources: '/api/v2/projects/:projectId/trainmodel',
            permissions: ['*']
        },{
            resources: '/api/v2/training/:trainingId',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/trainmodel/listalgorithm?columnName=colName',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/trainmodel/done',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/graph/trainmodel/scatter',
            permissions: ['*']
        }, {
            resources: '/api/v2/advtrainmodel/:trainingId/models/:modelId',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/report/trainmodel/multiunivariate',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/timeseries/preprocessing',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/timeseries/graphanalysis',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/timeseries/trainmodel',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/timeseries/trainmodel/:modelId/done',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/clustering/trainmodel/:modelId/done',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/clustering/trainmodel',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/predictive/target_details',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/predictive/calculate_feature_score',
            permissions: ['*']
        }, {
            resources: '/api/v2/training/:trainingId/model/:modelId/tune',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/timeseries/visualize/component',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/timeseries/stationarity_test',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/timeseries/visualize/autocorrelation',
            permissions: ['*']
        }, {
            resources: '/api/v2/projects/:projectId/training/sampling_percentage',
            permissions: ['*']
        },{
            resources: '/api/v2/training/feature/unique_categories',
            permissions: ['*']
        }]
    },{
        roles:['admin','report_user','developer', 'super_admin','pslite_user'],
        allows:[
            {
                resources: '/api/v2/projects/:projectId/clustering/visualize/optimise_clusters',
                permissions: ['*']
            },
            {
                resources: '/api/v2/training/:trainingId/models/:modelId/retrain',
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
