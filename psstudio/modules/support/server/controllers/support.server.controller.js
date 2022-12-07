const mongoose = require('mongoose');
const config = require('../../../../config/config');
const Ticket = mongoose.model('ticket');
const sendMail = require('../../../../utils/general/email.utils.server');
const moment = require('moment');
var date = Date(Date.now());
date = date.toString();
/**
 * Generates a new ticket
 * @param {*} req
 * @param {*} res
 */
exports.generateTicket = async (req, res) => {
  try {
    let data = req.body;
    let user = req.user;
    data.user = user._id;
    data.createdBy = user._id;
    const ticket = new Ticket(data);
    const docs = await ticket.save();
    if (docs) {
      let metaData1 = {};
      logger.info('Ticket created');
      metaData1.user = user;
      metaData1.ticketId = docs._id;
      metaData1.type = 'ticket';
      metaData1.description = docs.comment;
      const emailOpt1 = {
        subject: `${docs.subject} - Ticket Raised [${docs._id}]`,
        to: user.email,
      };
      sendMail.mailHandler(emailOpt1, metaData1);
      // Send mail to support@predictsense.io as well
      const emailBody = `<h2 style="text-transform: capitalize;">Hello Super Admin,</h2>
      <p>New ticket has been raised by <b style="text-transform: capitalize;">${user.displayName
        }</b> on ${moment(docs.createdAt).format('Do MMM YYYY, HH:mm:ss a')}</p>
      <p>Below are the details -</p>
      <p><b>Topic: </b>${docs.topic}</p> 
      <p><b>Comment: </b>${docs.comment}</p> 
      <p><b>Ticket Id: </b>${docs._id}</p>
      <p>Warm Regards,<br />The PredictSense Support Team</p>`;
      const mailOpt2 = {
        to: config.mailer.from,
        subject: `PredictSense Support - Ticket Raised [${docs._id}]`,
      };
      const metaData2 = {
        type: 'general',
        emailBody: emailBody,
      };
      sendMail.mailHandler(mailOpt2, metaData2);
      res.send(docs);
    } else {
      res.send({ code: 400, message: 'Cannot generate ticket.', data: docs });
    }
  } catch (err) {
    logger.error('Unable to generate ticket', { error: err, Date: date });
    res.status(400).send({ message: err });
  }
};

/**
 * Fetches all the tickets
 * @param {*} req
 * @param {*} res
 */
exports.getTickets = async (req, res) => {
  try {
    let user = req.user;
    let docs;
    if (user.roles[0] === 'super_admin') {
      docs = await Ticket.find({}).populate('user');
      // Filter tickets only for created users
      docs = docs.filter((item) => item.user);
    } else {
      docs = await Ticket.find({ user: user._id });
    }
    docs ? res.json(docs) : res.send({ code: 400, message: 'No tickets found.', data: docs });
  } catch (err) {
    logger.error('Could not foun tickets', { error: err, Date: date });
    res.status(400).send({ message: 'Could not find tickets' });
  }
};

/**
 * Updates the ticket by admin
 * @param {*} req
 * @param {*} res
 */
exports.updateTicket = async (req, res) => {
  try {
    let body = req.body;
    let ticketData = req.ticket;
    const docs = await Ticket.findByIdAndUpdate(
      { _id: ticketData._id },
      { status: body.status, updatedAt: Date.now(), solution: body.solution },
      { new: true }
    ).populate('user');
    if (docs) {
      if (body.status === 'closed') {
        let user = docs.user;
        let emailBody = `<h2 style="text-transform: capitalize;">Hello ${user.displayName},</h2>
        <p>Thank you for writing to us and we understand your concern. This is in relation to your ticket number: <b>${ticketData._id}</b>.</p>
        <p>Your complaint has been closed from our end, as we believe that, we have successfully resolved your complaint.</p>
        <p>Below is the resolution for your raised ticket :</p>
        <h3 style="padding: 12px;background-color: whitesmoke;">${body.solution}</h3>
        <p>In case you are not satisfied with the resolution or required any further assistance, please revert us back.</p>
        <p>Thanks for your patience!</p>
        <p>Warm Regards,<br />The PredictSense Support Team</p>`;
        let mailOpt = {
          to: user.email,
          subject: `PredictSense Support - Ticket Raised [${ticketData._id}]`,
          html: emailBody,
          replyTo: config.mailer.replyTo,
        };
        const metaData = {
          type: 'general',
          emailBody: emailBody,
        };
        sendMail.mailHandler(mailOpt, metaData);
      }
      logger.info('Ticket status updated', { Date: date });
      res.send(docs);
    } else {
      res.send({ code: 400, message: 'No record found', data: docs });
    }
  } catch (err) {
    logger.error('Could not update status', { error: err, Date: date });
    res.status(400).send({ message: 'Could not update status' });
  }
};

/**
 * Middleware for validating the user and fetching ticket data by id and attaching it to req
 * @param req
 * @param res
 * @param next
 * @param id
 */
exports.ticketById = async (req, res, next) => {
  try {
    const docs = await Ticket.findOne({ _id: req.body._id, createdBy: req.body.createdBy });
    if (docs) {
      req.ticket = docs;
      next();
    } else {
      req.ticket = null;
      next();
    }
  } catch (err) {
    logger.error('Error while finding ticket', { error: err, Date: date });
    next(err);
  }
};
