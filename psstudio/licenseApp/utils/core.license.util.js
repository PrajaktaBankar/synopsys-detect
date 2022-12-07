/**
 * Created by dushyant on 23/6/16.
 */
'use strict';
var algorithm = 'aes-256-ctr',
    password = '9R@BgTM%Ej5KJe!*#UJZxHMY87MQSFP';
var http = require('http');
var fs = require('fs');
var path = require('path');
var config = require(path.resolve('./config/config'));
var os  = require('os');


//var soap = require('soap');
//var stegger = require('stegger');
var exec = require('child_process').execSync;
var CronJob = require('cron').CronJob;
var fs = require('fs');
var request = require('request');
var path = require('path');
var crypto = require("crypto");

var logger = require(path.resolve('logger'));

var coreSystemUtil = require('../../utils/system/core.system.utils.js');
var crypter = require('../../utils/crypt/crypter');

var url = 'http://winjitdemoapps.cloudapp.net/WinjitLM-webs/LMWebService.asmx?WSDL';
var productName = "PredictSense";
var productVersion = "1.6.0";
var moduleName = 'PredictSense';

var key = 'homie';  //ToDo: Get a secure key
var passphrase = 'agent47';  //ToDo: Get a secure passphrase
var licFile = 'logo.jpg';
var textLicFile = 'gdm.lic';
var machineName = undefined;
var license;
var encryptData = crypter.encryptObject({"flag":false,"date":new Date('2022-08-01'),"ExpireDateflag":false,"isTemperedSysDate":false,"stopScheduler":false});
// console.log('this is decrypted data : ', encryptData, crypter.decryptObject(encryptData));
!fs.existsSync(path.resolve(__dirname, 'activate-data.json')) && fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptData));
// var activateConfig = require("./activate-data.json");
let Readdata = fs.readFileSync("./licenseApp/utils/activate-data.json");
var activateConfig = crypter.decryptObject(Readdata.toString());
var activateData=activateConfig;
// console.log('this is activateconfig data : ', activateConfig, typeof(activateConfig));

// Uncomment following for hardcoded machine details during developement.
// machineName="9QRLF32\nx86_64\ndushyant-3543";

// Comment the following for hardcoded machine details during developement.
try
{

if(os.platform().toString().indexOf('win32') !== -1 )
{// Windows
     var serial = exec("wmic bios get serialnumber ", {stdio: []}).toString().replace(/\s/g,'').replace("SerialNumber","");
     var cpu = exec("wmic cpu get ProcessorId ", {stdio: []}).toString().replace(/\s/g,'').replace("ProcessorId","");
     var host = os.hostname().replace(/\s/g,'');
     machineName = serial+'\\'+cpu+'\\'+host.replace(/\s/g,'');
}
else { //Linux
    machineName = process.env.MACHINE_INFO || exec("dmidecode -s system-serial-number && cat /proc/cpuinfo | grep Serial | cut -d ':' -f 2 &&  uname -m && uname -n", {stdio: []});
    // machineName = exec("dmidecode -s system-serial-number && cat /proc/cpuinfo | grep Serial | cut -d ':' -f 2 &&  uname -m && uname -n", {stdio: []});
}
if (!machineName)
{
    if (!machineName) {
        throw new Error();
    }
}
machineName = machineName.toString();

} catch (e)
{
    console.log(e);
    logger.error("Unable to get system details for licensing. Make sure you run the application with root/admin privileges");
    process.exit(1);
}

let myCron = new CronJob('0 */12 * * *', function () {
    isValid(function (valid) {
        if (!valid) {
            logger.error('License is not valid');

            // Restart service or reboot machine
            coreSystemUtil.restartService();
        }
    })
}, true);
myCron.start();
exports.activateLicenseOnline = function (activationData, callback)
{


    activationData.machineName = machineName;
    activationData.productName = productName;
    activationData.productVersion = productVersion;

    var encryptedJson = crypter.encryptObject(activationData);

    if (activationData.activation == "offline") {

        var jsonData = {"details": encryptedJson}
        return callback(null, jsonData);
    }

    else {
        // url: "http://winjit-iot.cloudapp.net:9090/api/license/online",
        var options = {
            method: "POST",
            body: {details: encryptedJson}, // Javascript object
            json: true,// Use,If you are sending JSON data
            url: "http://license.winjit.com/api/license/online",

        };
        request(options, function (err, response) {

            var integrity = false;
            var decJson = crypter.decryptObject(response.body.response)
            license = decJson;

            console.log(err);
            if (err) {
                console.log(err);
                done();
            }
            else if (!license) {
                err = {};
                err.message = response.body.message || "Please check your serial key."
                done();
            }
            else {
                integrity = checkIntegrity(license);
                let newErr = {};
                console.log(integrity);
                if (integrity){
                    if(license.serial==activateConfig.key && activateConfig.ExpireDateflag){
                        newErr.errMessage = "License has been expired.";
                        done(newErr);
                    } else if(activateConfig.isTemperedSysDate && !activateConfig.ExpireDateflag){
                        var today = new Date();
                        var licExpDate = new Date(license.expDate);
                        var licActDate = new Date(license.actDate);
                        // this date is used to check if the system date has been tempered or not;
                        var activateConfigDate = new Date(activateConfig.date);
                        if(today >= licActDate && today <= licExpDate && today >= activateConfigDate){
                            saveLicense(license, function (err, success) {
                                if (!err){
                                    activateConfig.date=new Date();
                                    activateConfig.key=license.serial;
                                    activateConfig.flag=true;
                                    activateConfig.isTemperedSysDate = false;
                                    activateConfig.ExpireDateflag=false;
                                    var encryptedJson = crypter.encryptObject(activateConfig);
                                    fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
                                    coreSystemUtil.restartService();
                                    done()
                                }
                            });
                        } else {
                            if (today < activateConfigDate) {
                                newErr.errMessage = "System date has been tempered.";
                            } else if(today > licExpDate || today < licActDate){
                                newErr.errMessage = "License has been expired.";
                            }
                            done(newErr);
                        }
                    } else {
                        saveLicense(license, function (err, success) {
                            if (!err){
                                activateConfig.date=new Date();
                                activateConfig.key=license.serial;
                                activateConfig.flag=true;
                                activateConfig.isTemperedSysDate = false;
                                activateConfig.ExpireDateflag=false;
                                var encryptedJson = crypter.encryptObject(activateConfig);
                                fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
                                coreSystemUtil.restartService();
                                done()
                            }
                        });
                    }
                }
                else done();
            }
            function done(hell) {
                let errToPass = hell ? hell : integrity
                if (callback)
                    callback(err, errToPass);
                console.log("called function Done");
            }
        });

    }

};

exports.activateLicenseOffline = function (filedata, callback)
{
    var response = filedata.lic;
    // console.log('this is json data of license : ', filedata , ' : ' , response);
    response = JSON.parse(response);
    // console.log('this is parsed result of license json : ', response, response.response);
    var decJson = crypter.decryptObject(response.response);
    license = decJson;
    // console.log('this is decjson file created adn stored to lic : ', decJson ,' : ', license);
    if(license.serial==activateConfig.key && activateConfig.ExpireDateflag){
        newErr.errMessage = "License has been expired.";
        callback(true,{message: newErr.errMessage});
    } else if(activateConfig.isTemperedSysDate && !activateConfig.ExpireDateflag){
        var today = new Date();
        var licExpDate = new Date(license.expDate);
        var licActDate = new Date(license.actDate);
        // this date is used to check if the system date has been tempered or not;
        var activateConfigDate = new Date(activateConfig.date);
        if(today >= licActDate && today <= licExpDate && today >= activateConfigDate){
            saveLicense(license, function (err, success){
                // console.log('this is save license callback : ', license, success, err);
                if (!err){
                    activateConfig.date=new Date();
                    activateConfig.key=license.serial;
                    activateConfig.flag=true;
                    activateConfig.ExpireDateflag=false;
                    activateConfig.isTemperedSysDate = false;
                    // console.log('this is license activate offline : ', activateData);
                    var encryptedJson = crypter.encryptObject(activateConfig);
                    fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
                    callback(null,{message:"activated license"});
                    coreSystemUtil.restartService();
                }else{
                    callback(err,{message:"Failed to activate license."});
                }
    
            });
        }else{
            if (today < activateConfigDate) {
                callback(true,{message:"System date has been tempered."});
            } else if(today > licExpDate || today < licActDate){
                callback(true,{message:"License has been expired."});
            }
        }
    } else {
        saveLicense(license, function (err, success){
            // console.log('this is save license callback : ', license, success, err);
            if (!err){
                activateConfig.date=new Date();
                activateConfig.key=license.serial;
                activateConfig.flag=true;
                activateConfig.ExpireDateflag=false;
                // console.log('this is license activate offline : ', activateData);
                var encryptedJson = crypter.encryptObject(activateConfig);
                fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
                callback(null,{message:"activated license"});
                coreSystemUtil.restartService();
            }else{
                callback(err,{message:"Failed to activate license."});
            }

        });
    }
};

exports.isValid = isValid;

function isValid(callback, response) {

    // Uncomment for skipping license validation
    // WARNING: For developement purpose only!
    Readdata = fs.readFileSync("./licenseApp/utils/activate-data.json");
    activateConfig = crypter.decryptObject(Readdata.toString());
    activateData=activateConfig;

    // console.log('this is activate config data:271', activateConfig);
    //return callback(true);
    // Load license
    readLicense(function (err, license) {

        if (err) {
            var schedulerUtil = require('../../utils/system/scheduler.system.utils');
            // logic to find the schedulers and create or delete the jobs based on license expiry.
            activateConfig.stopScheduler = true;
            // Object.entries(schedulerUtil.myJobs).length && schedulerUtil.shutDownGracefully(schedulerUtil.myJobs);
            schedulerUtil.schedule.gracefulShutdown().then(() => {
                console.log('schedulers stopped!');
                schedulerUtil.shutDownGracefully();
            }).catch( (e)=> console.log('this is err : ',e));
            console.log('Batman! Someone messed with the license! Integrity check failed');
            var encryptedJson = crypter.encryptObject(activateConfig);
            fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
            fs.existsSync(path.resolve('gdm.lic')) && fs.unlinkSync(path.resolve('gdm.lic'));
            console.log('license file deleted!');
            return callback(false);
        }

        // Check integrity
        var integrity = checkIntegrity(license);
        if (!integrity) {
            var schedulerUtil = require('../../utils/system/scheduler.system.utils');
            // logic to find the schedulers and create or delete the jobs based on license expiry.
            activateConfig.stopScheduler = true;
            // Object.entries(schedulerUtil.myJobs).length && schedulerUtil.shutDownGracefully(schedulerUtil.myJobs);
            schedulerUtil.schedule.gracefulShutdown().then(() => {
                console.log('schedulers stopped!');
                schedulerUtil.shutDownGracefully();
            }).catch( (e)=> console.log('this is err : ',e));
            console.log('Batman! Someone messed with the license! Integrity check failed');
            var encryptedJson = crypter.encryptObject(activateConfig);
            fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
            fs.existsSync(path.resolve('gdm.lic')) && fs.unlinkSync(path.resolve('gdm.lic'));
            console.log('license file deleted!');
            return callback(false);
        }

        //read allowed modules
        // config.allowedModules = {
        //     basic: "true",
        //     edgeAnalytics: license.edgeAnalytics,
        //     edgeComputing: license.edgeComputing,
        //     compression: license.compression,
        //     udd: license.udd,
        //     expDate: new Date(license.expDate),
        //     serial: license.serial
        // };
        config.allowedModules = {
            basic: "true",
            expDate: new Date(license.expDate)
        };
        config.license={
            trainingLimit:license['limits']['trainingLimit'] || 10,
            projectLimit:license['limits']['projectLimit'] || 10,
            userLimit:license['limits']['userLimit'] || 2
        };
        console.log(config.allowedModules.expDate);
        console.log(new Date());
        var today = new Date();
        var licExpDate = new Date(license.expDate);
        var licActDate = new Date(license.actDate);
        // this date is used to check if the system date has been tempered or not;
        var activateConfigDate = new Date(activateConfig.date);
        var schedulerUtil = require('../../utils/system/scheduler.system.utils');
        if(!activateConfig.stopScheduler){
            activateConfig.date=new Date(today);
            var encryptedJson = crypter.encryptObject(activateConfig);
            fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
            // console.log('this is date update clause when the date is less then today : ', activateConfig, activateConfigDate, today);
        }
        // console.log('this is activate config data:339', activateConfig, today, activateConfigDate, licActDate, licExpDate, today.getDate(), activateConfigDate.getDate(), today.getYear(),activateConfigDate.getFullYear());
        if(today >= licActDate && today <= licExpDate && today.getDate() >= activateConfigDate.getDate() && today.getMonth() >= activateConfigDate.getMonth()){
            if(today.getDate() !== activateConfigDate.getDate() || today.getMonth() !== activateConfigDate.getMonth() || today.getFullYear() !== activateConfigDate.getFullYear()){
                // logic to find the schedulers and create or delete the jobs based on license expiry.
                activateConfig.stopScheduler = true;
                // Object.entries(schedulerUtil.myJobs).length && schedulerUtil.shutDownGracefully(schedulerUtil.myJobs);
                schedulerUtil.schedule.gracefulShutdown().then(() => {
                    console.log('schedulers stopped!');
                    schedulerUtil.shutDownGracefully();
                }).catch((e)=>{console.log('this is err : ',e)});
                // console.log('this is activate config data:349', activateConfig, today, activateConfigDate, licActDate, licExpDate);
            }
            // console.log('this is jobs data : ', Object.entries(schedulerUtil.myJobs).length, schedulerUtil.myJobs, today.getHours(), today.getMinutes(), today.getTimezoneOffset());
            var tomorrow = new Date(today);
            if(today.getHours() == 0 && today.getMinutes() == 0){
                tomorrow.setMilliseconds(today.getMilliseconds()+19800000);
                tomorrow.toLocaleDateString();
                activateConfig.date=new Date(tomorrow);
                // console.log('this is the new date : with offset added : ',tomorrow);
            }else{
                activateConfig.date=new Date(today);
            }
            activateConfig.flag=true;
            activateConfig.isTemperedSysDate = false;
            var encryptedJson = crypter.encryptObject(activateConfig);
            fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
            // console.log('this is activate config data:356', activateConfig, today, activateConfigDate, licActDate, licExpDate);
            return callback((config.allowedModules.expDate > activateConfig.date) && activateConfig.flag);
        }else{
            // console.log('this is activate config data:359', activateConfig, today, activateConfigDate, licActDate, licExpDate);
            activateConfig.flag=false;
            activateConfig.isTemperedSysDate = true;
            if(config.allowedModules.expDate < activateConfig.date){
                activateConfig.ExpireDateflag=true;
            }
            // logic to find the schedulers and create or delete the jobs based on license expiry.
            activateConfig.stopScheduler = true;
            schedulerUtil.schedule.gracefulShutdown().then(() => { 
                console.log('schedulers stopped!');
                schedulerUtil.shutDownGracefully();
            }).catch((e)=>{console.log('this is err : ',e)});
	        // Object.entries(schedulerUtil.myJobs).length && schedulerUtil.shutDownGracefully(schedulerUtil.myJobs);
            console.log("Someone messed with system date.", today,activateConfig);
            var encryptedJson = crypter.encryptObject(activateConfig);
            fs.writeFileSync(path.resolve(__dirname, 'activate-data.json'), JSON.stringify(encryptedJson));
            fs.existsSync(path.resolve('gdm.lic')) && fs.unlinkSync(path.resolve('gdm.lic'));
            console.log('license file deleted!');
            // console.log('this is activate config data:377', activateConfig, today, activateConfigDate, licActDate, licExpDate);
            return callback((config.allowedModules.expDate > activateConfig.date) && activateConfig.flag);
        }
        // return callback(config.allowedModules.expDate > new Date());

    });
}
exports.licenseDetails = readLicense;
function readLicense(callback) {
    try {
        // Read file
        var license = fs.readFileSync(textLicFile);
        var license = crypter.decryptObject(license.toString());
        if (callback)
            return callback(null, license);

    }
    catch (e) {
        console.log(e);
        if (callback)
            return callback(e);
    }
}
exports.saveLicense = saveLicense;
function saveLicense(license, callback) {

    try {
        var lic = crypter.encryptObject(license);
        fs.writeFileSync(textLicFile, lic);

        if (callback)
            return callback(null, true);

    }
    catch (e) {

        console.error(e);
        if (callback)
            return callback(e);
    }

}
exports.checkIntegrity = checkIntegrity;
function checkIntegrity(license) {

    var hashData = license.hash;


    var primaryKey = hash(productName + productVersion + machineName);

    var s1 = hash(primaryKey);
    var s2 = hash(productName);
    var s3 = hash(primaryKey);
    var s4 = hash(s3 + s2);
    var s5 = hash(s2 + s1);
    var s6 = hash(s1);
    var s7 = hash(s6 + s5);
    var s8 = hash(s5 + s4);
    var s9 = hash(s4);
    var s10 = "##" + s1 + s2 + s3 + s4 + s5 + s6 + s7 + s8 + s9 + "%%";
    return s10 == hashData;


}
function CaesarCipher(str, num) {
    var result = '';
    var charcode = 0;

    for (var i = 0; i < str.length; i++) {
        charcode = (str[i].charCodeAt()) + num;
        result += String.fromCharCode(charcode);
    }
    return result;
}

function getWebSToken() {
    var str = "Winjit";
    str = str + productName;
    return hash(str);
}


function hash(str) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(str, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted.toUpperCase();
}
