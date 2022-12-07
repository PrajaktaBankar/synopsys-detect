var crypto = require('crypto');
var path = require('path');
var logger = require(path.resolve('./logger'));
const algorithm = "aes-256-cbc";
const initVector = '7777777a72ddc2f1';
const Securitykey = '6fa979f20126cb08aa645a8f495f6d85';
const config = require('../../config/config');
exports.encrypt = function (key, sourceData) {
  var iv = Buffer.alloc(16, 0); // Initialization vector
  var cipher = crypto.createCipheriv('aes-192-cbc', key.cipherKey, iv);
  var encrypted = cipher.update(sourceData, 'binary', 'binary');
  encrypted += cipher.final('binary');
  console.log(encrypted);
  return encrypted;
};

exports.decrypt = function (key, encryptedData) {
  var iv = Buffer.alloc(16, 0); // Initialization vector
  var decipher = crypto.createDecipheriv('aes-192-cbc', key.cipherKey, iv);
  var decrypted = decipher.update(encryptedData, 'binary', 'binary');
  decrypted += decipher.final('binary');
  return decrypted;
};

exports.encryption = function (sourceData) {
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
  let encryptedData = cipher.update(sourceData, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
};

exports.decryption = function (encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, Securitykey, initVector);
  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
};
// Uses the PBKDF2 algorithm to stretch the string 's' to an arbitrary size,
// in a way that is completely deterministic yet impossible to guess without
// knowing the original string
function stretchString(s, salt, outputLength) {
  return crypto.pbkdf2Sync(s, salt, 100000, outputLength, 'sha512');
}

// Stretches the password in order to generate a key (for encrypting)
// and a large salt (for hashing)
exports.keyFromPassword = function (passwordx) {
  var password =
    '=9FsEx`&XbUs[9#V]ZN(GE!aH!&63UePKu:+w(uaCY<rWN_vh</X<Vj$&5v$>/C.>]-)/avpmPB^g*ssU`*wWANVqz_D>2z]3GcThFcq6UxYtqtGSLbZ`e?;Q,!Mt';
  // We need 24 bytes for the key, and another 48 bytes for the salt
  var keyPlusHashingSalt = stretchString(password, 'salt', 24 + 48);
  return {
    cipherKey: keyPlusHashingSalt.slice(0, 24),
    hashingSalt: keyPlusHashingSalt.slice(24),
  };
};

/**
 * Verifies the checkout signature for authentic source of payment and successfull subscription
 * @param {*} options
 * @returns
 */
exports.verifyRzpSignature = (options) => {
  const hmac = crypto.createHmac('sha256', config.razorpay.secret);
  // Passing the data to be hashed
  const data = hmac.update(`${options.razorpay_payment_id}|${options.rzpSubId}`);
  // Creating the hmac in the required format
  const genHMAC = data.digest('hex');
  return genHMAC === options.razorpay_signature ? true : false;
};
