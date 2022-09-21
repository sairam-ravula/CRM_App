/*
 * This file will have the logic to schedule the time for sending mail
 */

const cron = require("node-cron");
const Notification = require("../models/notification.model");
const constants = require("../utils/constants");
const emailTransporter = require("../notifier/emailService");

cron.schedule("*/30 * * * * *", async () => {
  /*
   * I need to send the emails.
   * Get the list of all notifications to be sent
   * send email for each notification
   */
  console.log("CRON job started");

  const notifications = await Notification.find({
    sentStatus: constants.sentStatuses.unsent,
  });

  notifications.forEach((notification) => {
    const mailData = {
      from: "crm-notifications-service@gmail.com",
      to: notification.recepientEmails,
      subject: notification.subject,
      text: notification.content,
    };

    emailTransporter.sendMail(mailData, async (err, info) => {
      if (err) {
        console.log("Some error happened while sending the mail ", err);
      } else {
        const savedNotification = await Notification.findOne({
          _id: notification._id,
        });
        savedNotification.sentStatus = constants.sentStatuses.sent;
        await savedNotification.save();
      }
    });
  });
});
