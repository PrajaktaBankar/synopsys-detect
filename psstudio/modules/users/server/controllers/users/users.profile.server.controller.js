'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve(
    './modules/core/server/controllers/errors.server.controller'
  )),
  mongoose = require('mongoose'),
  multer = require('multer'),
  Apiaccess = mongoose.model('Apiaccess'),
  logger = require(path.resolve('./logger')),
  config = require(path.resolve('./config/config')),
  User = mongoose.model('User');
var date = Date(Date.now());
date = date.toString();
/**
 * Update user details
 */
exports.update = function (req, res) {
  // Init Variables
  var user = req.user;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + ' ' + user.lastName;

    user.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err),
        });
      } else {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in',
    });
  }
};

exports.resetData = function (req, res) {
  console.log('🚀 ~ Data', Data);
  var user = req.body;
  // Init Variables
  //user.markModified('data');
  console.log('🚀 ~ data', data);
  Apiaccess.updateOne(
    { user_id: user._id },
    {
      $set: { 'apis.$[].consumed': 0 },
    },
    function (err) {
      if (err) {
        if (res) {
          res.status(400).send({ message: 'Could not Update API Count' });
        }
      } else {
        res.json(user);
      }
    }
  );
};

exports.updateLayoutPreferences = function (req, res) {
  var user = req.user;
  if (user) {
    user.layout = req.body.layout;
    //user.viewAnimation = req.body.viewAnimation;
    user.updated = Date.now();
    user.save(function (err) {
      if (err) {
        logger.error('Unable to save user layout preferences', { error: err, Date: date });
        res.send(500);
      } else {
        logger.silly('User preferences saved');
        res.sendStatus(200);
      }
    });
  } else {
    res.sendStatus(403);
  }
};
/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
  var user = req.user;
  var message = null;
  var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
  var profileUploadFileFilter = require(path.resolve(
    './config/lib/multer'
  )).profileUploadFileFilter;

  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (user) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading profile picture',
        });
      } else {
        user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;

        user.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError),
            });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.status(400).send(err);
              } else {
                res.json(user);
              }
            });
          }
        });
      }
    });
  } else {
    res.status(400).send({
      message: 'User is not signed in',
    });
  }
};

/**
 * Creates the default user whenever PS is setup
 * @returns
 */
exports.createDefaultUser = async () => {
  try {
    let data;
    // using the mail from the env variable MAILER_EMAIL_ID, plz set it carefully as it will be used to fetch the respective user.
    const count = await User.find({ roles: ['super_admin'], email: `${process.env.MAILER_EMAIL_ID}` }).countDocuments();
    if (count === 0) {
      const user = new User({
        roles: ['super_admin'],
        firstName: 'Super',
        lastName: 'Admin',
        email: `${process.env.MAILER_EMAIL_ID}`,
        username: 'sudo',
        password: 'Winjit@123', // Updated Password to match new validation conditions  (Capitalized 'W')
        provider: 'local',
        displayName: 'Sudo',
        analytics: {
          dashboard1: {
            name: 'Dashboard 1',
            graphs: {
              graphId: [],
            },
            tiles: {
              tileId: [],
            },
            tables: {
              tableId: [],
            },
          },
          dashboard2: {
            name: 'Dashboard 2',
            graphs: {
              graphId: [],
            },
            tiles: {
              tileId: [],
            },
            tables: {
              tableId: [],
            },
          },
          dashboard3: {
            name: 'Dashboard 3',
            graphs: {
              graphId: [],
            },
            tiles: {
              tileId: [],
            },
            tables: {
              tableId: [],
            },
          },
        },
      });
      // Then save the user
      data = await user.save();
      if (!data) {
        data = `User not created`;
      }
      data = `User created`;
    } else {
      data = 'Default user present';
    }
    return data;
  } catch (error) {
    return `User creation failed - Error: ${error.message}`;
  }
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.json(req.user || null);
};
