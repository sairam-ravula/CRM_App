/*
 * This file will have the logic to schedule the time for sending mail
 */

const cron = require("node-cron");

cron.schedule("*/30 * * * * *", () => {
  /*
   * I need to send the emails.
   * Get the list of all notifications to be sent
   * send email for each notification
   */
});
