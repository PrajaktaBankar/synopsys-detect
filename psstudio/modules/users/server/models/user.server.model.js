'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');
owasp.config({
  minLength: 8,
});
/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return (this.provider !== 'local' && !this.updated) || property.length;
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return (this.provider !== 'local' && !this.updated) || validator.isEmail(email);
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name'],
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name'],
  },
  displayName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address'],
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: '',
  },
  oldPasswords: {
    type: JSON,
    default: [],
  },
  resetPassCount: {
    type: Number,
    default: 0,
  },
  resetPassDate: {
    type: Date,
    default: Date.now,
  },
  salt: {
    type: String,
  },
  subscription: {
    type: Schema.ObjectId,
    ref: 'subscription',
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png',
  },
  provider: {
    type: String,
    required: 'Provider is required',
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [
      {
        type: String,
        enum: [
          'report_user',
          'admin',
          'developer',
          'super_admin',
          'pslite_user',
          's_admin',
          's_developer',
        ],
      },
    ],
    default: ['report_user'],
    required: 'Please provide at least one role',
  },
  layout: {
    type: JSON,
  },
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  /* For reset password */
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  /* for email verification*/
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPromotionEmails: {
    type: Boolean,
  },
  userDomain: {
    type: String,
  },
  validationOtp: {
    type: String,
  },
  validity: {
    type: Date,
  },
  /* sudo can enable or disable user from login*/
  isEnabled: {
    type: Boolean,
    default: true,
  },
});

var ApiAccessSchema = new Schema({
  user_id: {
    type: String,
  },
  api_expiry: {
    type: String,
  },
  apis: {
    type: JSON,
  },
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    // converted password from binary to ascii
    let btoaPassHash = Buffer.from(String(this.password)).toString("base64");
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
    if(this.oldPasswords.length < 5) {
      (!this.oldPasswords.includes(btoaPassHash)) && this.oldPasswords.push(btoaPassHash);
    } else {
      if(!this.oldPasswords.includes(btoaPassHash)) {
        this.oldPasswords.shift();
        this.oldPasswords.push(btoaPassHash);
      }
    }
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto
      .pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64, 'sha1')
      .toString('base64');
    // return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64,'sha512').toString('base64');
    // return crypto.pbkdf2Sync(password, Buffer.from(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne(
    {
      username: possibleUsername,
    },
    function (err, user) {
      if (!err) {
        if (!user) {
          callback(possibleUsername);
        } else {
          return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
      } else {
        callback(null);
      }
    }
  );
};

/**
 * Generates a random passphrase that passes the owasp test.
 * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
 * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
 */
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase.
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * 20) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters.
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

exports.user = mongoose.model('User', UserSchema);
mongoose.model('Apiaccess', ApiAccessSchema);
