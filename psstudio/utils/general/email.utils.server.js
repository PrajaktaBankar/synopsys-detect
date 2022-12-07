'use strict';

const nodemailer = require('nodemailer');
const fs = require('fs');
const handlebars = require('handlebars');
const config = require('../../config/config');

/**
 * Handles the email sending html and params as required
 * @param {*} emailOpt
 * @param {*} metaData
 */
exports.mailHandler = async (emailOpt, metaData) => {
  try {
    let html, template, emailHTML;
    switch (metaData.type) {
      case 'welcome':
        html = fs
          .readFileSync('./utils/email-templates/welcome.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({
          appName: 'PredictSense',
          name: metaData.user.displayName,
          url: metaData.url.toString(),
        });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'freetrial-and-sub':
        html = fs
          .readFileSync('./utils/email-templates/freetrial-and-sub.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({
          appName: 'PredictSense',
          type: metaData.saasType,
          name: metaData.user.displayName,
          planStart: metaData.planStart,
          planEnd: metaData.planEnd,
          plan: metaData.planType,
        });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'upgrade':
        html = fs
          .readFileSync('./utils/email-templates/upgrade-plan.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({
          name: metaData.user.displayName,
          updateType: metaData.updateType,
          type: metaData.saasType,
          appName: 'PredictSense',
          plan: metaData.planType,
          planStart: metaData.planStart,
        });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'password-reset':
        html = fs
          .readFileSync('./utils/email-templates/password-reset.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({ appName: 'PredictSense', name: metaData.user.displayName });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'otp-verification':
        html = fs
          .readFileSync('./utils/email-templates/otp-verification.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({
          appName: 'PredictSense',
          name: metaData.user.displayName,
          otp: metaData.otp,
        });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'expire':
        html = fs
          .readFileSync('./utils/email-templates/expire.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({ appName: 'PredictSense', name: metaData.user.displayName });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'ticket':
        html = fs
          .readFileSync('./utils/email-templates/ticket.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({
          appName: 'PredictSense',
          name: metaData.user.displayName,
          ticketId: metaData.ticketId,
          description: metaData.description,
        });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'invite':
        html = fs
          .readFileSync('./utils/email-templates/invite.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({
          appName: 'PredictSense',
          name: metaData.user.displayName,
          inviter: metaData.inviter,
          url: metaData.url.toString(),
          username: metaData.user.username,
          password: metaData.decryptedPwd,
        });
        emailOpt.html = emailHTML;
        emailOpt.subject = emailOpt.subject;
        emailOpt.to = metaData.user.email;
        sendMail(emailOpt);
        break;

      case 'general':
        html = fs
          .readFileSync('./utils/email-templates/general.html', { encoding: 'utf-8' })
          .toString();
        template = handlebars.compile(html);
        emailHTML = template({
          emailBody: metaData.emailBody,
        });
        emailOpt.html = emailHTML;
        sendMail(emailOpt);
        break;
    }
  } catch (error) {
    logger.error('Error in mail handler function -' + error);
  }
};

/**
 * Function which sends the mail using SMTP transporter and returns the response
 * @param {*} emailOpt
 */
const sendMail = async (emailOpt) => {
  try {
    let smtpTransport = nodemailer.createTransport(config.mailer.options);
    emailOpt.attachments = config.mailer.attachments;
    emailOpt.from = config.mailer.from;
    emailOpt.replyTo = config.mailer.replyTo;
    smtpTransport.sendMail(emailOpt, (err, success) => {
      if (err) {
        logger.error('Mail error -' + err);
      } else {
        logger.info('Mail sent successfully');
      }
    });
  } catch (error) {
    logger.error('Error in send mail function -' + error);
  }
};
