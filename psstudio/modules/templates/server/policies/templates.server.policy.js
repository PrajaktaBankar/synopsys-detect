/**
 * Created by Saket on 17/10/17.
 */
'use strict';

var acl = require('acl');
acl = new acl(new acl.memoryBackend());

exports.invokeRolesPolicies = function () {
  acl.allow([
    {
      roles: [
        'admin',
        'developer',
        'super_admin',
        's_admin',
        's_developer',
      ],
      allows: [
        {
          resources: '/api/sampletemplates',
          permissions: '*',
        },
        {
          resources: '/api/sampletemplates/:templateId',
          permissions: '*',
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
