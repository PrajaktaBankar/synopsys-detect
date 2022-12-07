/**
 * Created by winjitian on 06/01/2020.
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
      roles: ['admin', 'developer', 'super_admin'],
      allows: [
        {
          resources: '/api/v2/sftp/list',
          permissions: ['*'],
        },
        {
          resources: '/api/v2/sftp',
          permissions: ['*'],
        },
        {
          resources: '/api/v2/sftp/:sftpId',
          permissions: ['*'],
        },
        {
          resources: '/api/v2/sftp/test/connection',
          permissions: ['*'],
        },
        {
          resources: '/api/v2/sftp/folderStructure/:sftpId',
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
          // return next();
        }
      }
    }
  );
};
