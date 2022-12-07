'use strict';
module.exports = {
  hostDetails: {
    protocol: 'http://',
    host: process.env.PSCORE_HOST + ':' || 'localhost:',
    port: process.env.PSCORE_PORT || 5000,
    // Will be used only for text-analysis API's
    taHost: process.env.TA_HOST + ':' || 'localhost:',
    taPort: process.env.TA_PORT || 5060,
  },
  notebookHost: {
    protocol: 'http://',
    host: process.env.JN_HOST + ':' || 'localhost:',
    jupyterPort: process.env.JN_PORT || 8888,
  },
};
