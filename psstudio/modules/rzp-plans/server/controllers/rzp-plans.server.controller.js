const request = require('../../../../utils/general/request');
const config = require('../../../../config/config');
const psConfig = require('../../../../config/lib/ps-config');
var date = Date(Date.now());
date = date.toString();
/**
 * Fetches all the plans from razorpay
 * @param {*} req
 * @param {*} res
 */
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await request(`${config.razorpay.url}/plans?count=100`, 'GET');
    plans.items =
      plans.items && plans.items.length
        ? plans.items.filter((item) => {
          return psConfig.plans.find((e) => e.id === item.id);
        })
        : res.status(400).send({ error: err, message: 'No plans found' });
    res.status(200).send(plans.items);
  } catch (err) {
    logger.error('Error while fetching plans: ' + err, { Date: date });
    res.status(500).send({ error: err, message: 'Error while fetching plans' });
  }
};
