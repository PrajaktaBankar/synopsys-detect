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
            resources: '/api/projects/:projectId/models',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/training/list',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/eda/done',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/eda/feature',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/download',
            permissions: ['*']
        }, {
            resources: '/api/prediction/:predictionId/download',
            permissions: ['*']
        }, {
            resources: '/api/prediction/:predictionId/read',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/analysis_report/report',
            permissions: ['*']
        }, {
            resources: '/api/models/:modelId/analysisReport/report',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/doprediction',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/cm/read',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/rl_plot/read',
            permissions: ['*']
        }, {
            resources: '/api/models/:modelId/analysisReport/download',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/graph/rocauc',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/report/classification',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/graph/learning_curve',
            permissions: ['*']
        }, {
            resources: '/api/models/:modelId/report/limeReport',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/cv',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/scoring/data',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/scoring/do',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/holdout',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/timeseries/forecast',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/clustering/visualize',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/graph/liftgain',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/qp/populate_form_data',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/graph/prcurve',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/timeseries/evaluate_forecast',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/get_pipelinetasks',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/get_pipelinetask/details',
            permissions: ['*']
        }, {
            resources: '/api/models/:modelId/graph/decision_tree',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/report/lime_report',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/list',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/deploy/:hostId',
            permissions: ['*']
        },
        {
            resources: '/api/projects/:projectId/decisionTree/download/:fileName',
            permissions: ['*']
        }, {
            resources: '/api/projects/:projectId/LimeReport/download/:fileName',
            permissions: ['*']
        },
        {
            resources: '/api/models/insertDeployment',
            permissions: ['*']
        },
        {
            resources: '/api/models/:modelId/featureImpact',
            permissions: ['*']
        },
        {
            resources: '/api/models/:modelId/featureDistribution',
            permissions: ['*']
        },
        {
            resources: '/api/models/:modelId/update',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/clustering/decisionTree',
            permissions: ['*']
        }, {
            resources: '/api/training/:trainingId/models/:modelId/clustering/heatMap',
            permissions: ['*']
        },
        {
            resources: '/api/projects/:projectId/clustering/visualize/scatterplot',
            permissions: ['*']
        }]   
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
