/**
 * Created by winjitian on 06/01/2020.
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * DbConnSchema Schema
 */
var DbConnSchema = new Schema(
  {
    name: {
      // commented bcz it was giving err when the same name connections are created by two diff roles user. so we need to rethink the logic.
      // unique: true,
      type: String,
    },
    // Source will be mssql,mysql,postgre, snowflake, s3
    source: {
      type: String,
    },
    // Driver name for mssql server
    driver: {
      type: String,
    },
    // AWS service name
    awsService: {
      type: String,
    },
    // AWS region name
    awsRegion: {
      type: String,
    },
    // AWS access_key_id
    awsKeyId: {
      type: String,
    },
    // AWS secret_access_key
    awsSecretKey: {
      type: String,
    },
    // Snowflake account name
    sfAccount: {
      type: String,
    },
    // BigQuery private key
    bqPrivateKey: {
      type: String,
    },
    // BigQuery project id
    bqProjectId: {
      type: String,
    },
    // BigQuery client email
    bqClientEmail: {
      type: String,
    },
    address: {
      type: String,
    },
    port: {
      type: Number,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);
mongoose.model('DbConn', DbConnSchema);
