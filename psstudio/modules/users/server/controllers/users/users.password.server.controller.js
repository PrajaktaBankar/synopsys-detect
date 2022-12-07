'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve(
    './modules/core/server/controllers/errors.server.controller'
  )),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  crypto = require('crypto');

const sendMail = require('../../../../../utils/general/email.utils.server');
var smtpTransport = nodemailer.createTransport(config.mailer.options);
var date = Date(Date.now());
date = date.toString();
/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall(
    [
      // Generate random token
      function (done) {
        crypto.randomBytes(20, function (err, buffer) {
          var token = buffer.toString('hex');
          done(err, token);
        });
      },
      // Lookup user by username
      function (token, done) {
        if (req.body.username) {
          User.findOne(
            {
              username: req.body.username.toLowerCase(),
            },
            '-salt -password',
            function (err, user) {
              if (!user) {
                logger.info('No account with that username has been found', { Date: date });
                return res.status(400).send({
                  message: 'No account with that username has been found',
                });
              } else if (user.provider !== 'local') {
                logger.error('It seems like you signed up', { Date: date });
                return res.status(400).send({
                  message: 'It seems like you signed up using your ' + user.provider + ' account',
                });
              } else {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                  done(err, token, user);
                });
              }
            }
          );
        } else {
          return res.status(400).send({
            message: 'Username field must not be blank',
          });
        }
      },
      function (token, user, done) {
        var httpTransport = 'http://';
        if (config.secure && config.secure.ssl === true) {
          httpTransport = 'https://';
        }
        res.render(
          path.resolve('modules/users/server/templates/reset-password-email'),
          {
            name: user.displayName,
            appName: config.app.title,
            url: httpTransport + req.headers.host + '/api/auth/reset/' + token,
          },
          function (err, emailHTML) {
            done(err, emailHTML, user);
          }
        );
      },
      // If valid email, send reset email using service
      function (emailHTML, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.mailer.from,
          subject: 'Password Reset',
          html: emailHTML,
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          if (!err) {
            res.send({
              message: 'An email has been sent to the provided email with further instructions.',
            });
          } else {
            logger.error('Failure sending mail', { Date: date });
            return res.status(400).send({
              message: 'Failure sending email',
            });
          }

          done(err);
        });
      },
    ],
    function (err) {
      if (err) {
        return next(err);
      }
    }
  );
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    },
    function (err, user) {
      if (!user) {
        return res.redirect('/password/reset/invalid');
      }

      res.redirect('/password/reset/' + req.params.token);
    }
  );
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {
              $gt: Date.now(),
            },
          },
          function (err, user) {
            if (!err && user) {
              if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                user.password = passwordDetails.newPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

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
                        // Remove sensitive data before return authenticated user
                        user.password = undefined;
                        user.salt = undefined;

                        res.json(user);

                        done(err, user);
                      }
                    });
                  }
                });
              } else {
                return res.status(400).send({
                  message: 'Passwords do not match',
                });
              }
            } else {
              return res.status(400).send({
                message: 'Password reset token is invalid or has expired.',
              });
            }
          }
        );
      },
      function (user, done) {
        res.render(
          'modules/users/server/templates/reset-password-confirm-email',
          {
            name: user.displayName,
            appName: config.app.title,
          },
          function (err, emailHTML) {
            done(err, emailHTML, user);
          }
        );
      },
      // If valid email, send reset email using service
      function (emailHTML, user, done) {
        var mailOptions = {
          to: user.email,
          from: config.mailer.from,
          subject: 'Your password has been changed',
          html: emailHTML,
        };

        smtpTransport.sendMail(mailOptions, function (err) {
          done(err, 'done');
        });
      },
    ],
    function (err) {
      if (err) {
        return next(err);
      }
    }
  );
};

/**
 * Change Password
 */
exports.changePassword = async function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, async function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              // checking if the new password is already in oldPasswords list, if yes, return 400.
              if (!user.oldPasswords.includes(Buffer.from(passwordDetails.newPassword).toString("base64"))) {
                user.password = passwordDetails.newPassword;
                // logic to compare the dates of last password change and current date
                const currentDate = new Date();
                const lastPasswordChangeDate = new Date(user.resetPassDate);
                const currentDateString = String(currentDate.getDate() + ':' + currentDate.getMonth() + ':' + currentDate.getFullYear());
                const resetPassDateString = String(lastPasswordChangeDate.getDate() + ':' + lastPasswordChangeDate.getMonth() + ':' + lastPasswordChangeDate.getFullYear());
                if (currentDateString === resetPassDateString) {
                  if (user.resetPassCount < 5) {
                    user.resetPassCount += 1;
                  } else {
                    return res.status(400).send({
                      message: 'You have exceeded the maximum number of password changes allowed for the day',
                    });
                  }
                } else {
                  user.resetPassCount = 1;
                  user.resetPassDate = currentDate;
                }
                user.save(async function (err, docs) {
                  if (err) {
                    return res.status(400).send({
                      message: errorHandler.getErrorMessage(err),
                    });
                  } else {
                    const sessionToDelete = await mongoose.connection.db.collection('sessions').find();
                    sessionToDelete.forEach(async (item) => {
                      let session = JSON.parse(item.session);
                      if (session.passport.user == docs._id) {
                        await mongoose.connection.db.collection('sessions').findOneAndDelete({ _id: item._id });
                      }
                    });
                    req.login(user, function (err) {
                      if (err) {
                        res.status(400).send(err);
                      } else {
                        res.send({
                          message: 'Password changed successfully',
                        });
                      }
                    });
                  }
                });
              } else {
                res.status(400).send({ message: 'New password should not be same as old password' });
              }
            } else {
              res.status(400).send({
                message: 'Passwords do not match',
              });
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect',
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found',
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password',
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in',
    });
  }
};
/**
 * Change Password by admin
 */
exports.changePasswordByAdmin = function (req, res) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;
  if (passwordDetails.aid) {
    User.findById(passwordDetails.aid, function (err, adm) {
      if (err) {
        res.status(400).send({
          message: 'Unauthorized user',
        });
      } else {
        if (passwordDetails.uid) {
          if (passwordDetails.newPassword) {
            User.findById(passwordDetails.uid, async function (err, user) {
              if (!err && user) {
                if (user.username != passwordDetails.userName) {
                  return res.status(400).send({
                    message: 'Invalid username',
                  });
                }
                if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                  if(!user.oldPasswords.includes(Buffer.from(String(passwordDetails.newPassword)).toString("base64"))){ 
                    user.password = passwordDetails.newPassword;
                    // logic to compare the dates of last password change and current date
                    const currentDate = new Date();
                    const lastPasswordChangeDate = new Date(user.resetPassDate);
                    const currentDateString = String(currentDate.getDate() + ':' + currentDate.getMonth() + ':' + currentDate.getFullYear());
                    const resetPassDateString = String(lastPasswordChangeDate.getDate() + ':' + lastPasswordChangeDate.getMonth() + ':' + lastPasswordChangeDate.getFullYear());
                    if (currentDateString === resetPassDateString) {
                      if (user.resetPassCount < 5) {
                        user.resetPassCount += 1;
                      } else {
                        return res.status(400).send({
                          message: 'You have exceeded the maximum number of password changes allowed for the day',
                        });
                      }
                    } else {
                      user.resetPassCount = 1;
                      user.resetPassDate = currentDate;
                    }
                    let userData = new User(user);
                    const docs = await userData.save();
                    if (docs) {
                      if (err) {
                        return res.status(400).send({
                          message: errorHandler.getErrorMessage(err),
                        });
                      } else {
                        logger.info('Password reset successfully');
                        res.send({
                          message: 'Password changed successfully',
                        });
                      }
                    } else {
                      res.status(400).send({ message: 'Could not reset password' });
                    }
                  } else {
                    res.status(400).send({
                      message: 'New password should not be same as old password',
                    });
                  }
                } else {
                  res.status(400).send({
                    message: 'Passwords do not match',
                  });
                }
              } else {
                res.status(400).send({
                  message: 'User not found',
                });
              }
            });
          } else {
            res.status(400).send({
              message: 'Please provide a new password',
            });
          }
        } else {
          res.status(400).send({
            message: 'User not found',
          });
        }
      }
    });
  } else {
    res.status(400).send({
      message: 'Unauthorized activity',
    });
  }
};

/**
 * function to generate the otp.
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.generateOTP = function (req, res) {
  // Declare a string variable
  // which stores all string
  let otpGenrateSting = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let OTP = '';

  // Find the length of string
  var len = otpGenrateSting.length;
  for (let i = 0; i < 6; i++) {
    OTP += otpGenrateSting[Math.floor(Math.random() * len)];
  }
  return OTP;
};

/**
 * function to validate the otp entered by the user.
 * @param {*} req
 * @param {*} res
 */
exports.validateOTP = async function (req, res) {
  const user = await User.findOne({
    username: req.params.userName || req.query.userName,
    resetPasswordToken: req.params.otp || req.query.otp,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });
  user
    ? res.send({
      message: 'User validated successfully',
    })
    : res.status(400).send({
      message: 'User validation failed',
    });
};

/**
 * Reset password for Saas/free trail versions
 * @param {*} req
 * @param {*} res
 */
exports.changePasswordForSaas = async (req, res) => {
  const passwordDetails = req.body;
  if (passwordDetails.userName) {
    const userData = await User.findOne({ username: passwordDetails.userName });
    if (userData && userData.isVerified) {
      if (passwordDetails.newPassword && passwordDetails.verifyPassword) {
        // checking if the new password is already in oldPasswords list, if yes, return 400.
        if (!userData.oldPasswords.includes(Buffer.from(passwordDetails.newPassword).toString("base64"))) {
          userData.password = passwordDetails.newPassword;
          // logic to compare the dates of last password change and current date
          const currentDate = new Date();
          const lastPasswordChangeDate = new Date(userData.resetPassDate);
          const currentDateString = String(currentDate.getDate() + ':' + currentDate.getMonth() + ':' + currentDate.getFullYear());
          const resetPassDateString = String(lastPasswordChangeDate.getDate() + ':' + lastPasswordChangeDate.getMonth() + ':' + lastPasswordChangeDate.getFullYear());
          if (currentDateString === resetPassDateString) {
            if (userData.resetPassCount < 5) {
              userData.resetPassCount += 1;
            } else {
              return res.status(400).send({
                message: 'You have exceeded the maximum number of password changes allowed for the day',
              });
            }
          } else {
            userData.resetPassCount = 1;
            userData.resetPassDate = currentDate;
          }
          userData.updated = Date.now();
          let user = new User(userData);
          const docs = await user.save();
          if (docs) {
            let metaData = {};
            metaData.user = docs;
            metaData.type = 'password-reset';
            let emailOpt = {
              subject: 'Password Reset Successfully - PredictSense',
              to: user.email,
            };
            sendMail.mailHandler(emailOpt, metaData);
            const sessionToDelete = await mongoose.connection.db.collection('sessions').find();
            sessionToDelete.forEach(async (item) => {
              let session = JSON.parse(item.session);
              if (session.passport.user == docs._id) {
                await mongoose.connection.db.collection('sessions').findOneAndDelete({ _id: item._id });
              }
            });
            logger.info('Password reset successfully');
            res.send({ message: 'Password reset successfully' });
          } else {
            res.status(400).send({ message: 'Could not reset password' });
          }
        } else {
          res.status(400).send({ message: 'New password should not be same as old password' });
        }
      } else {
        // code block for otp generation and sending mail.
        let generatedOtp = this.generateOTP();
        let userD = {}
        let queryObj = {
          _id: userData._id
        }
        userD.resetPasswordToken = generatedOtp;
        userD.resetPasswordExpires = Date.now() + 10 * 60000; // 10 mins
        User.findOneAndUpdate(queryObj, { resetPasswordToken: userD.resetPasswordToken, resetPasswordExpires: userD.resetPasswordExpires }, { new: true }, function (err, docs) {
          if (err) {
            logger.error("Could not create otp" + 'error: ' + err, { Date: date });
            if (res) {
              res.status(400).send({ message: "Could not create otp" });
            }
          } else {
            let user = docs;
            let metaData = {};
            metaData.user = docs;
            metaData.type = 'otp-verification';
            metaData.otp = docs.resetPasswordToken;
            let emailOpt = {
              subject: 'Verification Code - PredictSense',
              to: user.email,
            };
            sendMail.mailHandler(emailOpt, metaData);
            logger.info('OTP verification mail sent');
            res.send({ message: 'otp generated', email: user.email });
          }
        });
      }
    } else if (userData && !userData.isVerified) {
      res.status(400).send({
        message:
          'User is not verified. Please check your registered email or resend verification mail to activate your account',
      });
    } else {
      res.status(400).send({
        message: 'User not found for provided username',
      });
    }
  } else {
    res.status(400).send({
      message: 'Invalid username',
    });
  }
};
