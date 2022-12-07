'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  express = require('express'),
  morgan = require('morgan'),
  logger = require('./logger'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  mongoose = require('mongoose'),
  favicon = require('serve-favicon'),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  flash = require('connect-flash'),
  consolidate = require('consolidate'),
  path = require('path');
// var RED = require("../../../../psstudio-ui/node-red/packages/node_modules/node-red/lib/red");
var RED = require('../../node-red/packages/node_modules/node-red/lib/red');

const csurf = require('csurf');
const csrfInstance = csurf({ cookie: true });

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  preflightContinue: false,
};

//swager code
// const swaggerOptions = {
//   openapi: '3.0.1',
//   info: {
//     version: '1.0.0',
//     title: "PredictSense API's",
//     description: "API's for PredictSense Complete flow.",
//     contact: {
//       name: "PredictSense"
//     },
//     servers: ["http://localhost:3000"],
//     basePath: '/',
//   },
//   securityDefinitions: {
//     bearerAuth: {
//       type: 'apiKey',
//       name: 'auth',
//       scheme: 'bearer',
//       in: 'header',
//     },
//   },
//   apis: ["../../modules/swagger/server/routes/swagger.server.routes"]
// };

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = function (app) {
  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  if (config.secure && config.secure.ssl === true) {
    app.locals.secure = config.secure.ssl;
  }
  app.locals.keywords = config.app.keywords;
  app.locals.googleAnalyticsTrackingID = config.app.googleAnalyticsTrackingID;
  app.locals.facebookAppId = config.facebook.clientID;
  app.locals.jsFiles = config.files.client.js;
  app.locals.cssFiles = config.files.client.css;
  app.locals.livereload = config.livereload;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;

  // Sets the nonce token in index.html file in renderIndex()
  config.app.recaptchaNonce = generateToken();

  // Passing the request url to environment locals
  app.use(function (req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // app.use(helmet.xframe());

  process.env.NODE_ENV == 'development' ? app.use(cors(corsOptions)) : null;

  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(
    compress({
      filter: function (req, res) {
        return /json|text|javascript|css|font|svg/.test(res.getHeader('Content-Type'));
      },
      level: 9,
    })
  );

  // app.use(function (req, res, next) {
  //   res.setHeader("Content-Security-Policy", "script-src 'self'");
  //   return next();
  // });

  // app.use(
  //   helmet.frameguard({
  //     action: "DENY",
  //   })
  // );

  // Setting to prevent from CSRF attack, we have whitelist the DNS name or IP address
  app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy',
      `script-src 'nonce-${config.app.recaptchaNonce}' 'self' 'unsafe-eval' https://pendo-static-4517669377540096.storage.googleapis.com/guide-content/QWni6YQjgq8kdoxHnuKaW3vcm3M/CYhIwl5IrW4dHqy6k2GMCsoBE54/bdWZLkDskRiRbEEJKyrHpDUyIps.guide.js https://www.google.com/recaptcha/api.js https://cdn.pendo.io/agent/static/2067a9bc-0122-46f9-42af-9e43b6fb24d8/pendo.js`,
      "default-src 'self'",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self'"
    );
    next();
  });
  // pendo load guide content API SHA256 key used in above script-src
  // sha256=oDstsCPk87Sm7EjrBb2d8eusQoZQX1G700pMvBUVz-Y
  app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });
  // Initialize favicon middleware
  app.use(favicon(app.locals.favicon));

  // Enable logger (morgan)
  app.use(morgan(logger.getFormat(), logger.getOptions()));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  //app.use(bodyParser.urlencoded({
  //  extended: true
  //}));
  //app.use(bodyParser.json());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = function (app) {
  // Set swig as the template engine
  app.engine('server.view.html', consolidate[config.templateEngine]);

  // Set views path and view engine
  app.set('view engine', 'server.view.html');
  app.set('views', './');
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // Express MongoDB session storage
  app.use(
    session({
      saveUninitialized: true,
      resave: true,
      secret: config.sessionSecret,
      cookie: {
        maxAge: config.sessionCookie.maxAge,
        httpOnly: config.sessionCookie.httpOnly,
        secure: config.sessionCookie.secure && config.secure.ssl,
        sameSite: config.sessionCookie.sameSite,
      },
      key: config.sessionKey,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: config.sessionCollection,
      }),
    })
  );
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = function (app, db) {
  // config.files.server.configs.forEach(function (configPath) {
  //   require(path.resolve(configPath))(app, db);
  // });

  var lic = require('../../licenseApp/utils/core.license.util.js');
  lic.isValid(function (valid) {
    if (valid) {
      // config.files.server.routes.forEach(function (routePath)
      // {
      //   require(path.resolve(routePath))(app);
      // });
      config.files.server.configs.forEach(function (configPath) {
        require(path.resolve(configPath))(app, db);
      });
    } else {
      require('../../licenseApp/routes/license.routes.server')(app);
    }
  });
  // require('../../licenseApp/routes/license.routes.server')(app);
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  // app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.use(
    helmet.hsts({
      maxAge: SIX_MONTHS,
      includeSubdomains: true,
      force: true,
    })
  );
  app.use(helmet.frameguard());
  app.disable('x-powered-by');
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Docusaraus represents the react-app for predictsense docs
  app.use('/help', express.static(path.resolve('./public/docusaraus')));
  // Setting the app router and static folder
  app.use('/', express.static(path.resolve('./public')));
  // ng-ui represents angular ui code directory
  if (config.app.type === 'saas') {
    app.use('/', express.static(path.resolve('./public/ng-ui/saas')));
  } else {
    app.use('/', express.static(path.resolve('./public/ng-ui/enterprise')));
  }
};

/**
 * Configure the modules ACL policies
 */
module.exports.initModulesServerPolicies = function (app) {
  // Globbing policy files
  config.files.server.policies.forEach(function (policyPath) {
    require(path.resolve(policyPath)).invokeRolesPolicies();
  });
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = function (app) {
  var lic = require('../../licenseApp/utils/core.license.util.js');
  lic.isValid(function (valid) {
    if (valid) {
      // Globbing routing files
      config.files.server.routes.forEach(function (routePath) {
        require(path.resolve(routePath))(app);
      });
    } else {
      require('../../licenseApp/routes/license.routes.server')(app);
    }
  });
  // config.files.server.routes.forEach(function (routePath) {
  //   require(path.resolve(routePath))(app);
  // });
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function (err, req, res, next) {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }
    // Log it
    console.error('SERVER ERROR --->', err.stack);
    // Redirect to error page
    res.redirect('/server-error');
  });
};

/**
 * Configure Socket.io
 */
module.exports.configureSocketIO = function (app, db) {
  // Load the Socket.io configuration
  var server = require('./socket.io')(app, db);

  // Return server object
  return server;
};

/**
 * Init Node-RED settings and application
 */
module.exports.initNodeRED = function (app) {
  var settings = {
    httpAdminRoot: '/!',
    httpNodeRoot: '/api/',
    userDir: './node-red/flows',
    functionGlobalContext: {}, // enables global context
  };

  RED.init(app, settings);

  RED.start();
  config.RED = RED;

  app.use(settings.httpAdminRoot, RED.httpAdmin);
};

/**
 * Checks CSRF token for all API's calls, except the ones which we have excluded (called from pscore)
 * @param {*} app
 */
module.exports.conditionalCSRF = function (app) {
  app.use((req, res, next) => {
    csrfInstance(req, res, (err) => {
      // Within this function, and now within all routes that follow,
      // we have access to req.csrfToken()
      if (
        err &&
        (req.path.includes('/done') ||
          req.path.includes('/output') ||
          req.path.includes('/feature_repo/register_function') ||
          req.path.includes('/feature_repo/share_features') ||
          (process.env.NODE_ENV === 'development' && (req.hostname !== 'localhost' || req.hostname !== 'psstudio'))) &&
        err.code === 'EBADCSRFTOKEN'
      ) {
        //! Add below condition if working in dev
        // (req.hostname !== 'localhost' || req.hostname !== 'psstudio')

        // We will ignore the specific CSRF error for this specific path
        // Notice how we are not passing err back to next()
        next();
      } else {
        // Pass request along normally
        // If there is an error from CSRF or other middleware, it will be rethrown,
        // instead of being ignored
        next(err);
      }
    });
  });
};

function generateToken() {
  // Declare a string variable
  // which stores all string
  let otpGenrateSting = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let OTP = '';

  // Find the length of string
  var len = otpGenrateSting.length;
  for (let i = 0; i < 10; i++) {
    OTP += otpGenrateSting[Math.floor(Math.random() * len)];
  }
  return OTP;
}

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  // Initialize express app
  var app = express();

  // Initialize node-red app
  this.initNodeRED(app);

  // Initialize local variables
  this.initLocalVariables(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Setups the CSRF preotection
  this.conditionalCSRF(app);

  // Initialize modules static client routes
  this.initModulesClientRoutes(app);

  // Initialize modules server authorization policies
  this.initModulesServerPolicies(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  // Configure Socket.io
  app = this.configureSocketIO(app, db);

  return app;
};
