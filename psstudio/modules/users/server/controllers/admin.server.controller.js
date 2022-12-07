'use strict';


/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Subscription = mongoose.model('subscription'),
  Apiaccess = mongoose.model('Apiaccess');
const config = require('../../../../config/config');
errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  var obj = {};
  var queryObj = { user_id: req.model._id };
  var test = req.model;
  Object.assign(obj, test);
  Apiaccess.find(queryObj, function (err, docs) {
    if (err) {
      res.status(400).send({ message: 'Could not fetch Raw Files details!', err: err });
    }
    Object.assign(obj, { data: docs });
    res.send(obj);
  })

};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  if (config.app.type === 'enterprise' && req.body.roles) {
    // commented bcz this code for saas would probably never run but was giving err when uncommented.
  //   if (req.user.roles.includes('super_admin')) {
  //     user.roles = ['admin'];
  //   } else if (req.user.roles.includes('s_admin')) {
  //     user.roles = ['s_developer'];
  //   }
  // } else {
    user.roles = req.body.roles;
  }
  // code block for updating the validity and disable/enable user by sudo.
  if(req.user.roles.includes('super_admin')){
    user.validity = req.body.validity ? req.body.validity : null;
    !req.body.validity && delete req.body.validity;
    user.isEnabled = req.body.isEnabled;
    Subscription.findByIdAndUpdate(user.subscription, { planEnd: req.body.validity ? req.body.validity : null},
      function (err, docs) {
        if (err){
        console.log(err)
        }
        else{
        console.log("Subscription updated : ", docs, req.body.validity);
        }
      }
    );
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    Apiaccess.deleteOne({ user_id: user._id }, function (err) {

    });

    var finalData = {}
    if (req.body.data) {
      finalData.user_id = user._id;
      finalData.apis = req.body.data;
      var apiaccess = new Apiaccess(finalData);
      apiaccess.save(function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
        }
      });
    }


    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.deleteOne(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  var query = {};
  const activeSubsData = [];
  const validRoles = ['admin', 's_admin']
  var role = req.user.roles;
  const isAdminUser = role.every((i) => validRoles.includes(i));
  if (isAdminUser) {
    if (config.app.type === 'saas') {
      query = {
        roles: { $nin: ["super_admin"] },
        createdBy: req.user._id,
        //subscription: { $in: activeSubsData }
      }
    } else {
      query = {
        roles: { $nin: ["super_admin"] },
        // subscription: { $in: activeSubsData }
      }
    }
  } else if (req.user.roles.includes('s_developer') || req.user.roles.includes('developer')) {
    query = {
      roles: { $nin: ["super_admin"] },
      _id: { $nin: [req.user._id] },
      subscription: req.user?.subscription
    }
  } else {
    query = {
      roles: { $nin: ["super_admin"] },
      // subscription: { $in: activeSubsData }
    };
  }
  Subscription.find({ status: "active" })
    .then(data => {
      data.map((d, k) => {
        activeSubsData.push(d._id);
      })
      User.find(query, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        res.json(users);
      });
    });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
/**
 * Find a user by his email Id
 */
exports.findUserByEmail = function (email, callback) {
  User.findOne({ email: email }, function (err, user) {
    if (err || (!user)) {
      callback({ status: false, message: 'Could not find any record' }, null)
    }
    callback(null, user);
  })
}