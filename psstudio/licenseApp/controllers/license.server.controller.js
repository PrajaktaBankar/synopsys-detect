/**
 * Created by dushyant on 4/7/16.
 */

var licenseUtil = require('../utils/core.license.util.js');
var config = require('../../config/config');

exports.activateLicenseOnline = function (req, res) {

    licenseUtil.activateLicenseOnline(req.body, function (err, jsonData) {
        // console.log('this is ithe response obj for license activation : ',jsonData, err);
        if (err) {

            res.status(400).send(err.message);
            return;
        }
        else if (typeof jsonData == "object") {
            if(jsonData.errMessage){
                res.status(400).send(jsonData.errMessage);
                return;
            }else{
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    "content-disposition": "attachment; filename=\".itr\""
                });
                res.end(JSON.stringify(jsonData));
                console.log("license file downloaded");
            }
        }
        else {
            console.log("license activated online");
            res.send("License activated! Please restart PredictSense.<br><br><b>NOTE:</b> If you have <b><i>systemctl</i></b> service configured, PredictSense will restart automatically in 10 seconds.");

        }
    });


};

exports.activateLicenseOffline = function(req, res) {
    // console.log('this the req body and req : ', req, req.body);
    licenseUtil.activateLicenseOffline(req.body, function(err, jsonData){

        if (err) {

            res.status(400).send(err.message);
            return;
        }
        else {
            console.log("license activated online");
            res.send("License activated, please restart PredictSense.");

        }

    });
};
exports.licenseData = function(req, res) {
    licenseUtil.licenseDetails(function(err, licData) {
        if (err) {
            return res.status(400).send(err.message);
        }
        else {
            // console.log('this is licese data', licData);
            res.send({expDate: licData.expDate, actDate: licData.actDate, limits: licData.limits});
        }
    });
}
exports.licensePortal = function (req, res) {
    res.render('./licenseApp/views/licensePortal.server.view.jade', {nonceValue: config.app.recaptchaNonce});
};
