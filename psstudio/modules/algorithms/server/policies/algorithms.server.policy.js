/**
 * Created by Saurabh on 09/02/22
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: ['super_admin'],
      allows: [
        {
          resources: '/api/algorithm',
          permissions: ['*'],
        },
        {
          resources: '/api/algorithm/:algoId/delete',
          permissions: ['*'],
        },
        {
          resources: '/api/algorithm/:algoId/update',
          permissions: ['*'],
        },
        {
          resources: '/api/algorithm/:algoId/status/:status',
          permissions: ['*'],
        },
      ],
    },
    {
      roles: ['admin', 's_admin', 's_developer', 'super_admin', 'developer'],
      allows: [
        {
          resources: '/api/algorithm',
          permissions: ['get'],
        },
      ],
    },
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
