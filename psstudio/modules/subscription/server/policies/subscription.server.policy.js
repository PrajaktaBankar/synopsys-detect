/**
 * This is required only for SaaS version.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: ['admin', 'developer', 'super_admin','s_admin','s_developer'],
      allows: [
        {
          resources: '/api/user/subscription',
          permissions: '*',
        },
        {
          resources: '/api/user/:userId/restriction',
          permissions: '*',
        },
        {
          resources: '/api/user/:userId/subscription/:subscriptionId',
          permissions: '*',
        },
      ],
    },
    {
      roles: ['s_admin'],
      allows: [
        {
          resources: '/api/subscription/cancel',
          permissions: '*',
        },
      ]
    }
  ]);
};

/**
 * Check If Strain Config Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = req.user ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(
    roles,
    req.route.path,
    req.method.toLowerCase(),
    function (err, isAllowed) {
      if (err) {
        // An authorization error occurred.
        return res.status(500).send('Unexpected authorization error');
      } else {
        if (isAllowed) {
          // Access granted! Invoke next middleware
          return next();
        } else {
          return res.status(403).json({
            message: 'User is not authorized',
          });
        }
      }
    }
  );
};
