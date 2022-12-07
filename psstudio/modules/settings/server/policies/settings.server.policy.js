/**
 * Created by vishnu on 21/03/2018.
 */

'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Devices Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: ['admin', 'user', 'developer', 'super_admin', 'pslite_user'],
      allows: [
        {
          resources: '/api/settings/general',
          permissions: ['*'],
        },
        {
          resources: '/api/settings/:settingId/general',
          permissions: ['*'],
        },
      ],
    },
    {
      roles: ['admin', 'super_admin'],
      allows: [
        {
          resources: '/api/v2/model/:taModelId/download',
          permissions: ['*'],
        },
        {
          resources: '/api/v2/upload/model',
          permissions: ['*'],
        },
      ],
    },
  ]);
};

/**
 * Check If Devices Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = req.user ? req.user.roles : ['guest'];

  // If an device is being processed and the current user created it then allow any manipulation

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
