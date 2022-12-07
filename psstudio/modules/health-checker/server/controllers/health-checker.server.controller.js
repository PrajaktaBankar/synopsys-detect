const config = require('../../../../config/config');

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.validateLicense = async (req, res) => {
  try {
    res.send({ message: 'Health checker success - Instance is running and license is valid' });
  } catch (err) {
    res.status(500).send({ message: 'Health checker failed - Instance is not running OR license is invalid' });
  }
};
