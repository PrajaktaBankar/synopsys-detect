const moment = require('moment');
const Plans = require('../../config/lib/ps-config').plans;

/**
 * Calculates the end date as per the plan type
 * UNIX start date is not supported
 * @param {*} startDate UTC start date
 * @param {*} planId
 * @param {*} wantInUnix
 * @returns
 */
module.exports = async (startDate, planId, wantInUnix) => {
  let endDate;
  const planDuration = Plans.find((item) => item.id === planId).duration;
  if (planDuration === 'monthly') {
    endDate = moment(startDate).add(1, 'M').format();
  } else {
    endDate = moment(startDate).add(1, 'y').format();
  }
  return wantInUnix ? moment(endDate).unix() : endDate;
};
