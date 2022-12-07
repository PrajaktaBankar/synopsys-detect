const mongoose = require('mongoose');
const moment = require('moment');
const Subscription = mongoose.model('subscription');
const User = mongoose.model('User');
const PlansCollection = mongoose.model('plans');
const sendMail = require('../../../../utils/general/email.utils.server');
const request = require('../../../../utils/general/request');
const hideAndSeek = require('../../../../utils/crypt/hideandseek');
const config = require('../../../../config/config');
const Plans = require('../../../../config/lib/ps-config').plans;
const basicSubscription = require('../../../../config/env/plans/basic-subscription');
const proSubscription = require('../../../../config/env/plans/pro-subscription');
const calculateEndDate = require('../../../../utils/general/calculate-end-date.utils');
var date = Date(Date.now());
date = date.toString();
/**
 * Creates a new subscription record
 * @param {*} req
 * @param {*} res
 */
exports.handleSubscription = async (req, res) => {
  try {
    let docs;
    let subData = req.body;
    const rzpPlanData = req.body.rzpPlan;
    // Deletes the subscription, having status as created
    // i.e, user has already tried earlier, but didn't do payment
    await deleteSubscription(subData);
    if (subData.subscriptionId) {
      const existingSubDoc = await Subscription.findOne({
        _id: subData.subscriptionId,
        createdBy: subData.createdBy,
      });
      // console.log('🚀 ~ existingSubDoc --->', existingSubDoc);
      if (!existingSubDoc) {
        res
          .status(400)
          .send({ message: 'Sorry! No details found for your current active subscription' });
      }
      // For subscription during free trial is not ended or is going on
      if (
        existingSubDoc &&
        !subData.isFreeTrial &&
        existingSubDoc.isFreeTrial &&
        existingSubDoc.status === 'active' &&
        !existingSubDoc.planDuration &&
        !existingSubDoc.isCancelled
      ) {
        // Create the subscription start date in unix timestamp
        const dt = moment(existingSubDoc.planEnd).add(1, 'days').format();
        const subStartDate = moment(dt).unix();
        const rzpDocs = await createRzpSubscription(rzpPlanData.metaData.id, subStartDate);
        const upcomingPlan = rzpDocs.id;
        subData.planStart = dt;
        subData.rzpCustId = rzpDocs.customer_id;
        const psNewSubDoc = rzpDocs ? await createNewSubscription(subData, rzpDocs) : null;
        // Once razorpay subscription is created then update upcomingPlan in ps db
        docs = psNewSubDoc
          ? await updateSubscription(rzpDocs, existingSubDoc, subData, upcomingPlan)
          : null;
      }
      // For subscription after free trial has ended
      else if (!existingSubDoc.isFreeTrial && existingSubDoc.status === 'inactive') {
        const rzpDocs = await createRzpSubscription(rzpPlanData.metaData.id);
        // If razorpay subscription is created then create a new subscription in predictsense db also
        docs = rzpDocs ? await updateSubscription(rzpDocs, existingSubDoc, subData) : null;
      }
      // For subscription when, active sub is cancelled and want to start new one
      else if (
        existingSubDoc &&
        !subData.isFreeTrial &&
        !existingSubDoc.isFreeTrial &&
        existingSubDoc.status === 'active' &&
        existingSubDoc.isCancelled
      ) {
        // Create the subscription start date in unix timestamp
        const dt = moment(existingSubDoc.planEnd).add(1, 'days').format();
        // console.log('🚀 ~ exports.handleSubscription= ~ dt', dt);
        const subStartDate = moment(dt).unix();
        // console.log('🚀 ~ exports.handleSubscription= ~ subStartDate', subStartDate);
        const rzpDocs = await createRzpSubscription(rzpPlanData.metaData.id, subStartDate);
        const upcomingPlan = rzpDocs.id;
        subData.planStart = dt;
        subData.rzpCustId = rzpDocs.customer_id;
        existingSubDoc.upcomingPlan ? await deleteUpcomingSub(existingSubDoc, rzpDocs) : null;
        const psNewSubDoc = rzpDocs ? await createNewSubscription(subData, rzpDocs) : null;
        // Once razorpay subscription is created then update upcomingPlan in ps db
        docs = psNewSubDoc
          ? await updateSubscription(rzpDocs, existingSubDoc, subData, upcomingPlan)
          : null;
      }
    } else {
      // For direct subscription without free trial
      if (rzpPlanData && !subData.isFreeTrial) {
        const rzpDocs = await createRzpSubscription(rzpPlanData.metaData.id);
        // If razorpay subscription is created then create a new subscription in predictsense db also
        docs = rzpDocs ? await createNewSubscription(subData, rzpDocs) : null;
      }
      // For only free trial - create subscription in ps db only
      else {
        const planEnd = moment().add(config.freeTrialDays, 'days').format();
        docs = await createFreeTrialSubscription(subData, planEnd);
      }
    }
    // console.log('🚀 ~ docs ---->', docs);
    if (docs) {
      sendMailAndResponse(docs, res);
    } else {
      return res.send({ code: 400, message: 'Cannot create subscription', data: docs });
    }
  } catch (err) {
    logger.error('Unable to create subscription -' + err, { Date: date });
    return res.status(500).send({ message: err });
  }
};

/**
 * Fetches the subscription details for specific user
 * @param {*} req
 * @param {*} res
 */
exports.getSubscriptionDetails = async (req, res) => {
  try {
    let subData = req.subscription;
    let rzpDocs;
    if (subData) {
      // Fetches the details of normal subcription
      if (subData.upcomingPlan && subData.isFreeTrial) {
        // RZP API
        rzpDocs = await request(
          `${config.razorpay.url}/subscriptions/${subData.upcomingPlan}`,
          'GET'
        );
        if (rzpDocs.error) {
          logger.error(
            'Failed to fetch subscription details by ID - 1 :' + rzpDocs.error.description
          );
        } else {
          subData.upcomingPlan = rzpDocs;
          // Calculate plan end date if not present in rzp response doc
          if (!rzpDocs.current_end && rzpDocs.start_at) {
            const startDate = moment.unix(rzpDocs.start_at).utc().format();
            const planEnd = await calculateEndDate(startDate, rzpDocs.plan_id, true);
            subData.upcomingPlan.current_end = planEnd;
            subData.upcomingPlan.current_start = rzpDocs.start_at;
          }
        }
      }
      // Fetches the details if any upcoming plan which is upgraded/downgraded
      else if (subData.upcomingPlan && !subData.isFreeTrial) {
        // To fetch the created sub from upcoming plan
        if (subData.isCancelled) {
          // Calculate dates as in plan is upgraded
          if (subData.upcomingPlan.startsWith('plan')) {
            // RZP API
            rzpDocs = await request(
              `${config.razorpay.url}/subscriptions/${subData.rzpSubId}/retrieve_scheduled_changes`,
              'GET'
            );
            const dt = moment.unix(rzpDocs.current_end).utc().format();
            const startDate = moment(dt).add(1, 'days').format();
            rzpDocs.current_start = moment(startDate).unix();
            rzpDocs.current_end = await calculateEndDate(startDate, rzpDocs.plan_id, true);
          } else {
            // RZP API
            rzpDocs = await request(
              `${config.razorpay.url}/subscriptions/${subData.upcomingPlan}`,
              'GET'
            );
            // Calculate plan end date if not present in rzp response doc
            if (!rzpDocs.current_end && rzpDocs.start_at) {
              const startDate = moment.unix(rzpDocs.start_at).utc().format();
              const planEnd = await calculateEndDate(startDate, rzpDocs.plan_id, true);
              rzpDocs.current_end = planEnd;
            }
          }
          subData.upcomingPlan = rzpDocs;
        } else {
          // Calculate dates as in plan is upgraded
          if (subData.upcomingPlan.startsWith('plan')) {
            // RZP API
            rzpDocs = await request(
              `${config.razorpay.url}/subscriptions/${subData.rzpSubId}/retrieve_scheduled_changes`,
              'GET'
            );
            const dt = moment.unix(rzpDocs.current_end).utc().format();
            const startDate = moment(dt).add(1, 'days').format();
            rzpDocs.current_start = moment(startDate).unix();
            rzpDocs.current_end = await calculateEndDate(startDate, rzpDocs.plan_id, true);
          } else {
            // RZP API
            rzpDocs = await request(
              `${config.razorpay.url}/subscriptions/${subData.upcomingPlan}/retrieve_scheduled_changes`,
              'GET'
            );
          }
          subData.upcomingPlan = rzpDocs;
        }
        if (rzpDocs.error) {
          logger.error(
            'Failed to fetch subscription details by ID - 2 :' + rzpDocs.error.description,
            { Date: date }
          );
        }
        subData = subData;
        // console.log('🚀 ~ exports.getSubscriptionDetails= ~ subData --->', subData);
      } else {
        subData = subData;
      }
      res.json(subData);
    } else {
      res.status(400).send({ message: 'Subscription details not found' });
    }
  } catch (err) {
    logger.error('Could not found subscription details :' + err, { Date: date });
    res.status(400).send({ message: 'Could not found subscription details' });
  }
};

/**
 * Upgrades the subscription plan
 * @param {*} req
 * @param {*} res
 */
exports.upgradePlan = async (req, res) => {
  try {
    if (req.subscription) {
      const existingSubDoc = req.subscription;
      const doc = await upgradePlanHandler(existingSubDoc, req.body, res);
      if (!doc.error) {
        sendMailAndResponse(doc, res);
      } else {
        res.status(400).send({
          message: `${doc.error.description || 'Something went wrong. Cannot upgrade the plan'}`,
        });
      }
    } else {
      res.send(400).send({ message: 'Sorry! No details found for your current subscription' });
    }
  } catch (err) {
    logger.error('Could not upgrade the plan -' + err, { Date: date });
    res.status(400).send({ message: 'Could not upgrade the plan' });
  }
};

/**
 * Verifies the checkout signature for authentic source of payment and successfull subscription
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.verifyRzpPayment = async (req, res, next) => {
  try {
    const body = req.body;
    let planId;
    let isUpgraded = false;
    if (body.razorpay_payment_id) {
      const isVerified = hideAndSeek.verifyRzpSignature(body);
      if (isVerified) {
        let metaData = {};
        const userData = await User.findOne({
          _id: body.userId,
          subscription: body.subId,
        }).populate('subscription');
        // RZP API
        const rzpDocs = await request(
          `${config.razorpay.url}/subscriptions/${body.rzpSubId}`,
          'GET'
        );
        // console.log('🚀 ~ rzpDocs by ID ---->', rzpDocs);
        if (rzpDocs.error) {
          logger.error(
            'Failed to fetch subscription details after verification :' + rzpDocs.error.description,
            { Date: date }
          );
        }
        // Check for subscription during free trial
        if (
          !userData.subscription.planDuration &&
          userData.subscription.upcomingPlan &&
          userData.subscription.isFreeTrial
        ) {
          planId = rzpDocs.plan_id;
          isUpgraded = true;
        }
        // Check for direct subscription OR subscription after free trial is ended
        else {
          planId = userData.subscription.isCancelled ? rzpDocs.plan_id : body.rzpPlanId;
        }
        metaData.type = 'freetrial-and-sub';
        const plan = Plans.find((item) => item.id === planId);
        const sDate = moment.unix(rzpDocs.created_at).utc().format();
        const eDate = await calculateEndDate(sDate, planId, true);
        metaData.saasType =
          plan.duration === 'yearly' ? 'yearly subscription' : 'monthly subscription';
        metaData.user = userData;
        metaData.planType = plan.type.toUpperCase();
        metaData.planStart = moment.unix(rzpDocs.created_at).format('ddd, DD MMM YYYY');
        metaData.planEnd = moment.unix(eDate).format('ddd, DD MMM YYYY');
        const emailOpt = {
          subject: 'PredictSense Subscription',
          to: userData.email,
        };
        sendMail.mailHandler(emailOpt, metaData);
        res.send({ isVerified, subId: body.subId, isUpgraded });
      } else {
        res.status(400).send('Payment/subcription is not authorized');
      }
    } else {
      res.status(400).send('Some keys are missing, cannot authenticate');
    }
  } catch (err) {
    logger.error('Payment verification failed :' + err, { Date: date });
    res.status(500).send(err);
  }
};

/**
 * Cancels the subscription from razorpay
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const body = req.body;
    const subDoc = await Subscription.findOne({
      _id: body.subscription,
      createdBy: body._id,
    }).populate('createdBy');
    if (subDoc) {
      const rzpSubObj = {
        cancel_at_cycle_end: body.isCancelImmediately ? 0 : 1,
      };
      // RZP API
      const rzpDocs = await request(
        `${config.razorpay.url}/subscriptions/${subDoc.rzpSubId}/cancel`,
        'POST',
        rzpSubObj
      );
      // console.log('🚀 ~ CANCEL SUBSCRIPTION --->', rzpDocs);
      if (rzpDocs.error) {
        logger.error('Unable to cancel subscription, something went wrong', { Date: date });
        res
          .status(400)
          .send({ message: rzpDocs.error.description || 'Sorry! Something went wrong' });
      } else {
        const docs = await Subscription.findOneAndUpdate(
          {
            _id: body.subscription,
            rzpSubId: rzpDocs.id,
            rzpPlanId: rzpDocs.plan_id,
          },
          { isCancelled: true },
          { new: true }
        );
        const currPlan = Plans.find((item) => item.id === docs.rzpPlanId);
        logger.info('Subscription is cancelled', { Date: date });
        const emailBody = `<h2 style="text-transform: capitalize;">Hello ${
          subDoc.createdBy.displayName
        },</h2>
        <p>Your subscription for ${currPlan.type.toUpperCase()} (${
          currPlan.duration
        }) has been canceled successfully and is active through</p>
        <h2>${moment(docs.planEnd).format('MMMM D, YYYY')}</h2>
        <p>You'll still be able to take advantage of the subcription perks through this date, but you will not be charged a subscription fee moving forward.</p>
        <p>We're sorry to see you go! Let us know your experience to improve our service by sharing it on <a href="mailto:support@predictsense.io">support@predictsense.io</a>. We'll be glad to here from you.</p>
        <p>Warm Regards,<br />The PredictSense Team</p>`;
        const mailOpt = {
          to: subDoc.createdBy.email,
          subject: 'PredictSense - Subscription Canceled',
          html: emailBody,
          replyTo: config.mailer.replyTo,
        };
        const metaData = {
          type: 'general',
          emailBody: emailBody,
        };
        sendMail.mailHandler(mailOpt, metaData);
        res.send({ isCancelled: docs.isCancelled });
      }
    } else {
      logger.error('Unable to cancel subscription, no user found with this subscription', {
        Date: date,
      });
      res.status(400).send({ message: 'Sorry! No user found with this subscription' });
    }
  } catch (err) {
    logger.error('Unable to cancel subscription :' + err, { Date: date });
    res.status(500).send({ message: err });
  }
};

/**
 * Returns the response to PS and send the mail to the user after new subscription/free trial start
 * @param {*} docs
 * @param {*} res
 */
const sendMailAndResponse = async (docs, res) => {
  let metaData = {};
  let userData = await User.findByIdAndUpdate(
    { _id: docs.createdBy },
    { subscription: docs._id },
    { new: true }
  ).lean();
  delete userData.password;
  delete userData.salt;
  userData.status = docs.status;
  userData.isFreeTrial = docs.isFreeTrial;
  userData.rzpSubId = docs.rzpSubId || null;
  userData.rzpPlanId = docs.rzpPlanId || null;
  userData.upcomingPlan = docs.upcomingPlan || null;
  userData.hasFreeTrialUsed = true;
  userData.isCancelled = docs.isCancelled;
  userData.paymentCaptured = false;

  // Check to send mail only for free trial
  if (docs.isFreeTrial && !docs.planDuration && !docs.upcomingPlan) {
    metaData.saasType = '14 days free trial';
    metaData.user = userData;
    metaData.type = 'freetrial-and-sub';
    metaData.planType = docs.planType.toUpperCase();
    metaData.planStart = moment(docs.planStart).format('dddd, DD MMM YYYY');
    metaData.planEnd = moment(docs.planEnd).format('dddd, DD MMM YYYY');
    const emailOpt = {
      subject: 'PredictSense Free Trial',
      to: userData.email,
    };
    sendMail.mailHandler(emailOpt, metaData);
  }
  // else {
  //   metaData.saasType =
  //     docs.planDuration === 'yearly' ? 'yearly subscription' : 'monthly subscription';
  // }
  res.send(userData);
};

/**
 * Creates a new record for subscription on razorpay
 * @param {*} rzpPlanData
 * @param {*} res
 * @returns
 */
const createRzpSubscription = async (rzpPlanId, subStartDate = null) => {
  const rzpSubObj = {
    plan_id: rzpPlanId,
    total_count: config.razorpay.totalCount,
  };
  subStartDate ? (rzpSubObj.start_at = subStartDate) : null;
  // RZP API
  const rzpDocs = await request(`${config.razorpay.url}/subscriptions`, 'POST', rzpSubObj);
  // console.log('🚀 ~ RZP SUBSCRIPTION --->', rzpDocs);
  if (rzpDocs.error) {
    logger.error('Unable to create new razorpay subscription :' + rzpDocs.error.description, {
      Date: date,
    });
    return null;
  }
  return rzpDocs;
};

/**
 * Creates a new subscription into the predictsense db
 * @param {*} res
 * @param {*} subscriptionObj
 * @returns
 */
const createNewSubscription = async (subData, rzpDocs) => {
  try {
    const subscriptionObj = {
      planType: subData.planType,
      planDuration: subData.planDuration,
      isFreeTrial: false,
      createdBy: subData.createdBy,
      planStart: subData.planStart,
      rzpCustId: subData.rzpCustId || null,
      status: 'created',
      rzpSubId: rzpDocs.id,
      rzpPlanId: rzpDocs.plan_id,
    };
    const subscription = new Subscription(subscriptionObj);
    const docs = await subscription.save();
    if (!docs) {
      logger.error('Unable to create new subscription in PS', { Date: date });
      return null;
    }
    // console.log('🚀 ~ PS SUBSCRIPTION --->', docs);
    return ({ rzpSubId, rzpPlanId, status, isFreeTrial, _id } = docs);
  } catch (err) {
    logger.error('Unable to create new subscription in PS :' + err, { Date: date });
    return null;
  }
};

/**
 * Creates a new free trial subscription record into the predictsense db
 * @param {*} res
 * @param {*} subscriptionObj
 * @returns
 */
const createFreeTrialSubscription = async (subData, planEnd) => {
  try {
    const subscriptionObj = {
      planType: subData.planType || 'pro',
      planDuration: subData.isFreeTrial ? null : rzpPlanData.period,
      isFreeTrial: true,
      planEnd: planEnd,
      createdBy: subData.createdBy,
      status: 'active',
    };
    const subscription = new Subscription(subscriptionObj);
    const docs = await subscription.save();
    if (!docs) {
      logger.error('Unable to create free trial subscription', { Date: date });
      return null;
    }
    return docs;
  } catch (err) {
    logger.error('Unable to create free trial subscription :' + err, { Date: date });
    return null;
  }
};

/**
 * Upgrades the plan on razorapy and PS subscription table, by adding upcoming plan
 */
const upgradePlanHandler = async (existingSubDoc, reqBody) => {
  try {
    let updateType;
    const newPlanId = reqBody.metaData.id;
    // RZP API
    const subById = await request(
      `${config.razorpay.url}/subscriptions/${existingSubDoc.rzpSubId}`,
      'GET'
    );
    const rzpReqObj = {
      plan_id: newPlanId,
      schedule_change_at: reqBody.isUpgradeImmediately ? 'now' : 'cycle_end',
      remaining_count: subById.remaining_count,
    };
    // RZP API
    const rzpDocs = await request(
      `${config.razorpay.url}/subscriptions/${existingSubDoc.rzpSubId}`,
      'PATCH',
      rzpReqObj
    );
    // console.log('🚀 ~ UPGRADE RZP SUBSCRIPTION --->', rzpDocs);
    if (rzpDocs.error) {
      logger.error('Unable to upgrade to new plan :' + rzpDocs.error.description, { Date: date });
      return rzpDocs;
    }
    // Logic to identify what type of updation - upgraded/downgraded
    const newPlan = Plans.find((item) => item.id === newPlanId);
    const oldPlan = Plans.find((item) => item.id === existingSubDoc.rzpPlanId);
    newPlan.type === 'pro' && oldPlan.type === 'basic'
      ? (updateType = 'upgraded')
      : (updateType = 'downgraded');
    const docs = await updateSubscription(rzpDocs, existingSubDoc, reqBody, newPlanId);
    // console.log('🚀 ~ upgradePlanHandler ~ docs --->', docs);
    if (docs) {
      const userData = await User.findOne({
        _id: reqBody.createdBy,
        subscription: reqBody.subId,
      });
      // console.log('🚀 ~ upgradePlanHandler ~ userData --->', userData);
      let metaData = {};
      metaData.type = 'upgrade';
      metaData.user = userData;
      metaData.updateType = updateType;
      metaData.planType = newPlan.type.toUpperCase();
      metaData.planStart = moment(existingSubDoc.planEnd).add(1, 'days').format('ddd, DD MMM YYYY');
      metaData.saasType =
        newPlan.duration === 'yearly' ? 'yearly subscription' : 'monthly subscription';
      let mailOpt = {
        to: userData.email,
        subject: `PredictSense Subscription - Plan ${updateType}`,
      };
      logger.info('Plan has been upgraded', { Date: date });
      sendMail.mailHandler(mailOpt, metaData);
      return docs;
    } else {
      logger.error('No record found to upgrade the plan', { Date: date });
      return null;
    }
  } catch (error) {
    logger.error('Plan upgrade failed -' + error, { Date: date });
    return null;
  }
};

/**
 * Updates the existing subscription record
 * @param {*} rzpDocs
 * @param {*} existingSubDoc
 * @param {*} subData
 * @returns
 */
const updateSubscription = async (rzpDocs, existingSubDoc, subData, upcomingPlan = null) => {
  try {
    const subscriptionObj = {};
    if (upcomingPlan) {
      subscriptionObj.upcomingPlan = upcomingPlan;
      subscriptionObj.updatedAt = moment().format();
    } else {
      subscriptionObj.planType = subData.planType;
      subscriptionObj.planDuration = subData.planDuration;
      subscriptionObj.isFreeTrial = false;
      subscriptionObj.createdBy = subData.createdBy;
      subscriptionObj.status = 'created';
      subscriptionObj.rzpPlanId = rzpDocs.plan_id;
      subscriptionObj.rzpSubId = rzpDocs.id;
      subscriptionObj.updatedAt = moment().format();
    }
    const docs = await Subscription.findByIdAndUpdate(
      { _id: existingSubDoc._id },
      subscriptionObj,
      {
        new: true,
      }
    ).lean();
    if (!docs) {
      logger.error('Unable to update subscription in PS', { Date: date });
      return null;
    }
    // console.log('🚀 ~ PS SUBSCRIPTION UPDATED ---->', docs);
    return ({ rzpSubId, rzpPlanId, status, isFreeTrial, _id, upcomingPlan } = docs);
  } catch (err) {
    logger.error('Unable to update subscription in PS :' + err, { Date: date });
    return null;
  }
};

/**
 * Deletes the subcription if already created (status=created) by user and then updates the user table
 * @param {*} subData
 */
const deleteSubscription = async (subData) => {
  const createdSub = await Subscription.findOneAndDelete({
    // _id: subData.subscriptionId,
    createdBy: subData.createdBy,
    status: 'created',
  });
  // if (createdSub) {
  //   const deleted = await Subscription.deleteOne({
  //     _id: subData.subscriptionId,
  //     createdBy: subData.createdBy,
  //     status: 'created',
  //   });
  //   logger.info(
  //     'DELETED ' + deleted.deletedCount + ' created status subscriptions by ' + subData.createdBy
  //   );
  //   if (createdSub.createdBy) {
  //     await User.updateOne(
  //       { _id: subData.createdBy, subscription: createdSub._id },
  //       { subscription: null }
  //     );
  //     return true;
  //   } else {
  //     return false;
  //   }
  // } else {
  //   return false;
  // }
};

/**
 * Deletes the upcoming subcription if already created (status=created) by user
 * @param {*} subData
 */
const deleteUpcomingSub = async (existingSubDoc, rzpDocs) => {
  const createdSub = await Subscription.findOne({
    rzpSubId: existingSubDoc.upcomingPlan,
    createdBy: existingSubDoc.createdBy,
    status: 'created',
  });
  if (createdSub) {
    const deleted = await Subscription.deleteOne({
      rzpSubId: existingSubDoc.upcomingPlan,
      createdBy: existingSubDoc.createdBy,
      status: 'created',
    });
    logger.info(
      'DELETED ' +
        deleted.deletedCount +
        ' created upcoming subscriptions by ' +
        existingSubDoc.createdBy,
      { Date: date }
    );
  } else {
    return false;
  }
};

/**
 * Middleware for validating the user and fetching subscription data by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.subscriptionById = async (req, res, next) => {
  try {
    if (!['null', 'undefined', null, undefined].includes(req.params.subscriptionId)) {
      let createdBy = req.params.userId;
      /***
       * req.user['createdBy'] - this field will exist only for SaaS version and for an invited user
       */
      if (req.user['createdBy'] && req.user.roles.includes('s_developer')) {
        createdBy = req.user['createdBy'];
      }
      const docs = await Subscription.findOne({
        _id: req.params.subscriptionId,
        createdBy: createdBy,
      }).lean();
      if (docs) {
        req.subscription = docs;
        next();
      } else {
        req.subscription = null;
        next();
      }
    } else {
      req.subscription = null;
      next();
    }
  } catch (err) {
    logger.error('Error while finding subscription - ' + err, { Date: date });
    next(err);
  }
};

/**
 * Fetches the restriction details
 * @param {*} req
 * @param {*} res
 */
exports.getRestrictionDetails = (req, res) => {
  try {
    const userPlanType = req?.query?.planType;
    let psFeatureObj = {};
    let allowedFeaturesList = [];
    let enterpriseConnectionList = [];
    PlansCollection.find().exec(function (err, data) {
      if (err) {
        logger.error('Can not get plans data in manage plans', { Date: date })
      }
      let plansData = data.find(val => val.planType === userPlanType);
      // plansData.restrictionPlans.map(item => {
      //   psFeatureObj[item.moduleName] = item[item.moduleName];
      // });
      plansData.restrictionPlans.map(item => {
        item.rules.map(val => {
          (typeof(val.allowedValues) !== 'string') && (val.name !== 'enterpriseconnectionlist') && allowedFeaturesList.push(...val.allowedValues);
          if(val.name === 'numberofalgorithmsallowed'){
            psFeatureObj['trainingAlgoCount'] = val.allowedValues;
          }
          if(val.name === 'numberofprojectsforreward'){
            psFeatureObj['feedbackProjectRewardCount'] = val.allowedValues;
          }
          if(val.name === 'allowedfilesize'){
            psFeatureObj['allowedPSFileUploadSize'] = val.allowedValues;
          }
          if(val.name === 'allowednumberofrows'){
            psFeatureObj['allowedNoOfRows'] = val.allowedValues;
          }
          if(val.name === 'allowednumberofcolumns'){
            psFeatureObj['allowedNoOfColumns'] = val.allowedValues;
          }
          if(val.name === 'enterpriseconnectionlist'){
            val.allowedValues = val.allowedValues.map(value => value.trim());
            val.values = val.values.map(data => data.trim());
            psFeatureObj['enterpriseConnectionList'] = val.allowedValues;
            psFeatureObj['allConnectionsList'] = val.values;
          }
          // console.log('this is length of allowed val : ', val.name, typeof(val.allowedValues));
        });
      });
      allowedFeaturesList = allowedFeaturesList.map(val => val.trim());
      psFeatureObj['allowedFeaturesList'] = allowedFeaturesList;
      
      (config.app.type === 'saas' && res.send(Object(psFeatureObj))) ||
        res.send({ message: 'No restriction details found.' });
      // console.log('this is the plan type in server : =================== : ',userPlanType, psFeatureObj);
    });
  } catch (error) {
    logger.error('Error in fetching restriction details - ' + error, { Date: date });
  }
};
