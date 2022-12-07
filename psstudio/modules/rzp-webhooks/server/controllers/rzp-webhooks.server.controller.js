const moment = require('moment');
const request = require('../../../../utils/general/request');
const config = require('../../../../config/config');
const psConfig = require('../../../../config/lib/ps-config');
const Socket = require('../../../../utils/socket/core.socket.utils');
var Order = require('../../../rzp-orders/server/models/rzp-orders.server.model').order;
var Subscription =
  require('../../../subscription/server/models/subscription.server.model').subscription;
var date = Date(Date.now());
date = date.toString();
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.handleWebhookEvents = async (req, res) => {
  try {
    const { event, payload } = req.body;
    const { subscription, payment } = payload;
    const uniqueId = req.headers['x-razorpay-event-id'];

    switch (event) {
      // Will be used only if future date is provided while creating new sub
      // Rs. 5 will be charged for verification, once successfull update the DB as authenticated
      case 'subscription.authenticated':
        console.log('🚀 ~ EVENT ---->', uniqueId, event);
        // console.log('🚀 ~ PAYLOAD --->', payload);
        await authenticateSubscription(uniqueId, subscription.entity);
        break;
      case 'subscription.charged':
        console.log('🚀 ~ EVENT ---->', uniqueId, event);
        // console.log('🚀 ~ PAYLOAD --->', payload);
        subUpdatedData = await updateSubscription(uniqueId, subscription.entity, payment.entity);
        if (subUpdatedData) {
          await createNewOrder(subUpdatedData, payment.entity, subscription.entity);
        }
        break;
      case 'subscription.activated':
        console.log('🚀 ~ EVENT ---->', uniqueId, event);
        // console.log('🚀 ~ PAYLOAD --->', payload);
        // subUpdatedData =
        await updateSubscription(uniqueId, subscription.entity);
        // subUpdatedData
        //   ? await createNewOrder(subUpdatedData, payment.entity, subscription.entity)
        //   : null;
        break;
      case 'subscription.pending':
        console.log('🚀 ~ EVENT ---->', uniqueId, event);
        // console.log('🚀 ~ PAYLOAD --->', payload);
        // subUpdatedData =
        await updateSubscription(uniqueId, subscription.entity);
        // subUpdatedData
        //   ? await createNewOrder(subUpdatedData, payment.entity, subscription.entity)
        //   : null;
        break;
      case 'subscription.paused':
        console.log('🚀 ~ EVENT ---->', uniqueId, event);
        // console.log('🚀 ~ PAYLOAD --->', payload);
        // subUpdatedData =
        await updateSubscription(uniqueId, subscription.entity);
        // subUpdatedData
        //   ? await createNewOrder(subUpdatedData, payment.entity, subscription.entity)
        //   : null;
        break;
      case 'subscription.halted':
        console.log('🚀 ~ EVENT ---->', uniqueId, event);
        // console.log('🚀 ~ PAYLOAD --->', payload);
        // subUpdatedData =
        await updateSubscription(uniqueId, subscription.entity);
        // subUpdatedData
        //   ? await createNewOrder(subUpdatedData, payment.entity, subscription.entity)
        //   : null;
        break;

      case 'subscription.cancelled':
        console.log('🚀 ~ EVENT ---->', uniqueId, event);
        // console.log('🚀 ~ PAYLOAD --->', payload);
        await cancelSubscription(uniqueId, subscription.entity);
        break;
    }
  } catch (err) {
    logger.error('Error in webhook handler, cannot process further :' + err, { Date: date });
  }
};

/**
 * Updates the subsription record in PS as ACTIVE, only if rzp status is ACTIVE
 * Else it will be INACTIVE for all other rzp status
 * @param {*} order
 * @param {*} payment
 */
const updateSubscription = async (eventId, subData) => {
  try {
    const subDoc = await Subscription.findOne({ rzpSubId: subData.id, rzpEventId: eventId });
    if (!subDoc) {
      const status = subData.status === 'active' ? 'active' : 'inactive';
      const docs = await Subscription.findOneAndUpdate(
        { rzpSubId: subData.id },
        {
          status: status,
          rzpEventId: eventId,
          planStart: moment.unix(subData.current_start).format(),
          planEnd: moment.unix(subData.current_end).format(),
          updatedAt: moment().format(),
          rzpCustId: subData.customer_id,
        },
        { new: true }
      ).lean();
      if (!docs) {
        logger.error('WEBHOOK - Unable to update subscription :' + docs, { Date: date });
      } else {
        logger.info('WEBHOOK - Subscription updated successfully.', { Date: date });
        return docs;
      }
    } else {
      return null;
    }
  } catch (err) {
    logger.error('WEBHOOK - Cannot update the subsription :' + err, { Date: date });
    return null;
  }
};

/**
 * Will be used only if future date is provided while creating new sub
 * Rs. 5 will be charged for verification, once successfull update the DB as authenticated
 * @param {*} eventId
 * @param {*} subData
 * @returns
 */
const authenticateSubscription = async (eventId, subData) => {
  try {
    const subDoc = await Subscription.findOne({ rzpSubId: subData.id, rzpEventId: eventId });
    if (!subDoc && subData.status === 'authenticated') {
      const oldDoc = await Subscription.findOne({ upcomingPlan: subData.id });
      if (oldDoc) {
        const docs = await Subscription.findOneAndUpdate(
          { rzpSubId: oldDoc.upcomingPlan },
          {
            status: subData.status,
            rzpEventId: eventId,
            updatedAt: moment().format(),
            rzpCustId: subData.customer_id,
          },
          { new: true }
        ).lean();
        if (!docs) {
          logger.error('WEBHOOK - Unable to authenticated subscription in PS DB :' + docs, { Date: date });
          Socket.emit(
            'RzpSubAuthenticated',
            {
              userId: oldDoc.createdBy,
              rzpSubId: subData.id,
              rzpPlanId: subData.plan_id,
              rzpCustId: subData.customer_id,
              rzpPayStatus: 'failed',
            },
            {
              createdBy: oldDoc.createdBy,
            }
          );
        } else {
          logger.info('WEBHOOK - Subscription authenticated in PS DB successfully.', { Date: date });
          Socket.emit(
            'RzpSubAuthenticated',
            {
              userId: docs.createdBy,
              rzpSubId: docs.rzpSubId,
              rzpPlanId: docs.rzpPlanId,
              rzpCustId: docs.rzpCustId,
              rzpPayStatus: docs.status,
              subId: docs._id,
              isUpgraded: subData.has_scheduled_changes,
            },
            {
              createdBy: docs.createdBy,
            }
          );
        }
      }
    } else {
      return null;
    }
  } catch (err) {
    logger.error('WEBHOOK - Cannotauthenticated subscription in PS DB :' + err, { Date: date });
    return null;
  }
};

/**
 * Cancels the subcription by setting the isCancelled flag as TRUE in PS
 * @param {*} eventId
 * @param {*} subData
 * @returns
 */
const cancelSubscription = async (eventId, subData) => {
  try {
    const subDoc = await Subscription.findOne({ rzpSubId: subData.id, rzpEventId: eventId });
    if (!subDoc) {
      const docs = await Subscription.findOneAndUpdate(
        { rzpSubId: subData.id },
        { status: 'inactive', rzpEventId: eventId, isCancelled: true },
        { new: true }
      ).lean();
      if (!docs) {
        logger.error('WEBHOOK - Unable to cancel subscription :' + docs, { Date: date });
      } else {
        logger.info('WEBHOOK - Subscription cancelled successfully.', { Date: date });
        return docs;
      }
    } else {
      return null;
    }
  } catch (err) {
    logger.error('WEBHOOK - Cannot cancel the subsription :' + err, { Date: date });
    return null;
  }
};

/**
 * Updates the subsription record in PS as ACTIVE only if rzp status is COMPLETED/ACTIVE, else it will be INACTIVE
 * @param {*} order
 * @param {*} payment
 */
const renewSubscription = async (eventId, subData) => {
  try {
    const subDoc = await Subscription.findOne({ rzpSubId: subData.id, rzpEventId: eventId });
    if (!subDoc) {
      const status = subData.status === 'completed' ? 'active' : 'inactive';
      const docs = await Subscription.findOneAndUpdate(
        { rzpSubId: subData.id },
        { status: status, rzpEventId: eventId, rzpOfferId: subData.offer_id || null },
        { new: true }
      ).lean();
      if (!docs) {
        logger.error('WEBHOOK - Unable to update subscription :' + docs, { Date: date });
      } else {
        logger.info('WEBHOOK - Subscription updated successfully.', { Date: date });
        return docs;
      }
    } else {
      return null;
    }
  } catch (err) {
    logger.error('WEBHOOK - Cannot update the subsription :' + err, { Date: date });
    return null;
  }
};

/**
 * Creates a new order once payment is successfull/captured
 * @param {*} id
 * @param {*} data
 */
const createNewOrder = async (psSubData, payment, rzpSubData) => {
  try {
    const orderDoc = await Order.findOne({ rzpPayId: payment.id, rzpOrderId: payment.order_id });
    if (!orderDoc) {
      const orderObj = {
        subId: psSubData._id,
        rzpPayId: payment.id,
        rzpOrderId: payment.order_id,
        rzpPayMethod: payment.method,
        rzpPayStatus: payment.status,
        rzpInvoiceId: payment.invoice_id,
        rzpOfferId: rzpSubData.offer_id,
        rzpPlanId: rzpSubData.plan_id,
      };
      const order = new Order(orderObj);
      const docs = await order.save();
      if (!docs) {
        logger.error('WEBHOOK - Unable to create new order :' + docs, { Date: date });
      } else {
        console.log('🚀 ~ createNewOrder ~ psSubData --->', psSubData);
        Socket.emit(
          'RzpPaymentDone',
          {
            userId: psSubData.createdBy,
            rzpSubId: psSubData.rzpSubId,
            rzpPlanId: psSubData.rzpPlanId,
            rzpCustId: psSubData.rzpCustId,
            rzpPayStatus: payment.status,
            subId: psSubData._id,
            isUpgraded: rzpSubData.has_scheduled_changes,
          },
          {
            createdBy: psSubData.createdBy,
          }
        );
        logger.info('WEBHOOK - Order created successfully.', { Date: date });
        return docs;
      }
    } else {
      return null;
    }
  } catch (err) {
    logger.error('WEBHOOK - Unable to create order :' + err, { Date: date });
    return null;
  }
};
