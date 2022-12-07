/**
 * Created by dushyant on 19/4/16.
 */
var crypto = require('crypto');
var secretKey1 = '7E8EC812FB0D443A0952206F86E7CCEF6DC52B9A317A34DAB25A477ADD141555';
var secretKey = 'asdwerftthuyloinhjsethnbhsekinfr';
var iv = 'ashbethjdopwhvnc';
var path = require('path');
var logger = require(path.resolve('./logger'));

exports.encryptObject = function (json)
{
    try
    {
        var cipher = crypto.createCipheriv('aes-256-cbc', secretKey,iv);
        var crypted = cipher.update(JSON.stringify(json), 'utf8', 'base64');
        crypted += cipher.final('base64');
        return crypted;
    }
    catch (e)
    {
        logger.error('Unable to encrypt object', e);
        return json;
    }
};

exports.decryptObject = function (text)
{
    try
    {
        if (text === null || typeof text === 'undefined')
        {
            return text;
        }
        var decipher = crypto.createDecipheriv('aes-256-cbc', secretKey,iv);
        var dec = decipher.update(text, 'base64', 'utf8');
        dec += decipher.final('utf8');
        dec = JSON.parse(dec);
        return dec;
    }
    catch (e)
    {
        logger.error('Unable to decrypt object', e);
        return text;
    }
};

exports.encrypt = function (text)
{
    try
    {
        if (!text)
            return text;
        var cipher = crypto.createDecipheriv('aes-256-cbc', secretKey1,iv);
        var crypted = cipher.update(text, 'utf8', 'base64');
        crypted += cipher.final('base64');
        return crypted;
    }
    catch (e)
    {
        logger.error('Unable to encrypt', e);
        return text;
    }
};

exports.decrypt = function (text)
{
    try
    {
        if (text === null || typeof text === 'undefined' || text == '')
        {
            return text;
        }
        var decipher = crypto.createDecipheriv('aes-256-cbc', secretKey1,iv);
        var dec = decipher.update(text, 'base64', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
    catch (e)
    {
        logger.error('Unable to decrypt', e);
        return text;
    }
};

exports.caesarCipher = function (str, num)
{
    var result = '';
    var charcode = 0;

    for (var i = 0; i < str.length; i++)
    {
        charcode = (str[i].charCodeAt()) + num;
        result += String.fromCharCode(charcode);
    }
    return result;
};
