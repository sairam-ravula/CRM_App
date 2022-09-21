/*
 * Logic to make a POST call to the Notification service
 */

const Client = require("node-rest-client").Client;

const client = new Client();

/*
*Expose a function which will take the following information
**
*subject
*content
*recepientEmails
*requester
*ticketId

* and then make a POST call
*/

module.exports = (ticketId, subject, content, emailIds, requester) => {
  /*
   * POST Call
   *   -URI : 127.0.0.1
   *   -HTTP Verb : POST
   *   - Request body
   *   - headers
   */
  const reqBody = {
    subject: subject,
    content: content,
    recepientEmails: emailIds,
    requester: requester,
    ticketId: ticketId,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  const args = {
    data: reqBody,
    headers: headers,
  };

  client.post(
    "http://127.0.0.1:7777/notifServ/api/v1/notifications",
    args,
    (data, response) => {
      console.log("Request Sent");
      console.log(data);
    }
  );
};
