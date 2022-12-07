'use strict';

module.exports = {
  app: {
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || '',
    type: process.env.APP_TYPE || 'enterprise',
    roles: {
      S_ADMIN: 's_admin',
      S_DEV: 's_developer',
    },
    useCaptcha: process.env.CAPTCHA === 'true' || false, 
  },
  secure: {
    ssl: true,
    privateKey: './config/sslcerts/key.pem',
    certificate: './config/sslcerts/cert.pem',
  },
  port: process.env.PORT || 8443,
  db: {
    uri:
      process.env.MONGOHQ_URL ||
      process.env.MONGOLAB_URI ||
      'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/wj-psense',
    options: {
      user: '',
      pass: '',
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false,
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
        fileName: process.env.LOG_FILE || 'access.log',
        rotatingLogs: {
          // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: process.env.LOG_ROTATING_ACTIVE === 'true' ? true : false, // activate to use rotating logs
          fileName: process.env.LOG_ROTATING_FILE || 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: process.env.LOG_ROTATING_FREQUENCY || 'daily',
          verbose: process.env.LOG_ROTATING_VERBOSE === 'true' ? true : false,
        },
      },
    },
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || 'APP_ID',
    clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/facebook/callback',
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: '/api/auth/twitter/callback',
  },
  google: {
    clientID: process.env.GOOGLE_ID || 'APP_ID',
    clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/google/callback',
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || 'APP_ID',
    clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/linkedin/callback',
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: '/api/auth/github/callback',
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: '/api/auth/paypal/callback',
    sandbox: false,
  },
  recaptcha: {
    // Use for normal recaptcha
    // secretKey: '6Lc8P64bAAAAADgPn0L7fkcuiqcF0sYMezYbkFG_',

    // Use for invisible recaptcha
    secretKey: '6Lck0AkeAAAAAHCNHsyipwWYcRTHrEx8NGCkqg9O',
    validationUrl: 'https://www.google.com/recaptcha/api/siteverify?',
  },
  mailer: {
    from:
      `PredictSense Support Team <${process.env.MAILER_EMAIL_ID}>` ||
      'PredictSense Support Team <your_mail_id>',
    replyTo:
      `PredictSense Support Team <${process.env.MAILER_EMAIL_ID}>` ||
      'PredictSense Support Team <your_mail_id>',
    options: {
      // service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      // host: 'smtp.gmail.com',
      service: process.env.MAILER_SERVICE_PROVIDER || 'outlook365',
      host: process.env.MAILER_HOST || 'smtp.office365.com',
      port: process.env.MAILER_PORT || 587,
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'your_mail_id',
        pass: process.env.MAILER_PASSWORD || 'your_password',
      },
    },
    attachments: [
      {
        filename: 'logo_login.png',
        path: './public/img/brand/logo_login.png',
        cid: 'logo_login_814',
      },
    ],
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user'],
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin'],
      },
    },
  },
  freeTrialDays: 14,
  razorpay: {
    id: 'rzp_test_57tq4fRRTohhVp',
    secret: '6n9krtb6eRnWg7Ufx7ccFIjA',
    url: `https://rzp_test_57tq4fRRTohhVp:6n9krtb6eRnWg7Ufx7ccFIjA@api.razorpay.com/v1`,
    totalCount: 5,
  },
  disableAlgorithms: {
    saas: [
      '6sgd_egression',
      '19theil_sen_regression',
      '13mlp_regression',
      '15nusv_regression',
      '14kernel_ridge_regression',
      '12ard_regression',
      '34artificial_neural_network_classification',
      '35artificial_neural_network_regression',
    ],
  },
};
