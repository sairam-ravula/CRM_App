const Notification = require("../models/notification.model");

/*
 * Controller for the notification request
 */

/*
 *Accept a new notification request and return a new tracking_id
 */
exports.acceptNotificationRequest = async (req, res) => {
  const notificationObj = {
    subject: req.body.subject,
    content: req.body.content,
    recepientEmails: req.body.recepientEmails,
    requester: req.body.requester,
    ticketId: req.body.ticketId,
  };
  try {
    const notification = await Notification.create(notificationObj);

    res.status(201).send({
      requestId: notification.ticketId,
      message: "Accepted Request - It's is in Progress",
    });
  } catch (err) {
    console.log("Error while accepting a notification request");
    res.status(500).send({
      message: "Error while accepting a notification request",
    });
  }
};

/*
 * Check the notification status (if email is SENT OR UN_SENT) using the tracking_id
 */
