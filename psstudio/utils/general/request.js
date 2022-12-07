const request = require('request');

/**
 * Handles the request made and returns promise
 * @param {} url requested url
 * @param {*} httpVerb GET/POST/PUT/DELETE/PATCH
 * @param {*} body request body
 * @returns
 */
module.exports = async (url, httpVerb, body) =>
  new Promise((resolve, reject) => {
    const options = {
      url: url,
      method: httpVerb,
      body: body,
      json: true,
    };
    request(options, (error, response, data) => {
      error
        ? reject({ error: true, message: error.message || error.msg || 'Something went wrong!' })
        : resolve(data);
    });
  });
