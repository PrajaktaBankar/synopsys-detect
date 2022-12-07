'use strict';

module.exports = {
  app: {
    title: 'PredictSense',
    description: 'PredictSense',
    keywords: 'PredictSense',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || ''
  },
  projectDir:'projects',
  //While importing project will be uploaded to upload/user directory
  projectUploadDir:'upload',
  //After extracting files will be under extracted/user directory
  projectExtractionDir:'extracted',
  //Uploaded project config file
  projectConfigFile:'config.json',
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: true,
    sameSite: 'strict'
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId-PS',
  sessionCollection: 'sessions',
  logo: 'public/img/brand/logo.png',
  favicon: 'public/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: './public/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    }, fileUpload: {
      limits: {
        noOfRowsPermitForPsLite: 30000,
        noOfColsPermitForPsLite: 35
      }
    }
  },
  usecaseLimit:100
};
