/*
 *Version v1 - Anyone should be able to create a ticket
 */

const User = require("../models/user.model");
const constants = require("../utils/constants");
const Ticket = require("../models/ticket.model");

const ObjectConverter = require("../utils/objectConverter");
const notificationServiceClient = require("../utils/notificationServiceClient");

exports.createTicket = async (req, res) => {
  //* Logic to create the ticket
  try {
    const ticketObject = {
      title: req.body.title,
      ticketPriority: req.body.ticketPriority,
      description: req.body.description,
      reporter: req.userID, // From access token
    };
    /*
     * check If any engineer is available
     */
    console.log("here");
    const engineer = await User.findOne({
      userType: constants.userType.engineer,
      userStatus: constants.userStatus.approved,
    });
    if (engineer) {
      ticketObject.assignee = engineer.userID;
    }
    console.log("here1");
    const ticketCreated = await Ticket.create(ticketObject);
    /*
     * Ticket is created now
     * 1. We need to update customer and engineer document
     */

    //* Find out the customer and update
    if (ticketCreated) {
      const user = await User.findOne({
        userID: req.userID,
      });
      user.ticketsCreated.push(ticketCreated._id);
      await user.save();

      /*
       * Update the engineer
       */
      console.log(user);
      if (engineer) {
        engineer.ticketsAssigned.push(ticketCreated._id);
        await engineer.save();
      }
      notificationServiceClient(
        ticketCreated._id,
        "Created a new ticket : " + ticketCreated._id,
        ticketCreated.description,
        engineer.email + "," + user.email,
        user.email
      );
    }
    return res.status(201).send(ObjectConverter.ticketResponse(ticketCreated));
  } catch (err) {
    console.log("message: " + err.message);
    return res.status(501).send({
      message: "Some internal error",
    });
  }
};

/*
 * API to fetch all tickets

 * Allow the user to filter based on state

 * Extension:
 * Using query params, Allow the user to filter the tickets
 * based on status 
 */

exports.getAllTickets = async (req, res) => {
  const queryObj = {};
  if (req.query.status != undefined) {
    queryObj.status = req.query.status;
  }

  const user = await User.findOne({ userID: req.userID });
  if (user.userType == constants.userType.admin) {
    //*No need to do anything in the query object
    //* Return all the tickets
  } else if (user.userType == constants.userType.customer) {
    if (user.ticketsCreated == null || user.ticketsCreated.length == 0) {
      return res.status(200).send({
        message: "You haven't created any tickets!!!",
      });
    }
    queryObj._id = {
      $in: user.ticketsCreated, //* array of ticket ids
    };
  } else {
    var engineerTickets = [];
    if (user.ticketCreated) engineerTickets.push(...user.ticketsCreated);
    if (user.ticketsAssigned) engineerTickets.push(...user.ticketsAssigned);
    queryObj._id = {
      $in: engineerTickets,
    };
  }

  /*
   *I need to get all the ticket IDs
   */
  // * const ticketList = [];
  // * user.ticketsCreated.forEach(async (t) => {
  // *   ticketList.push(await Ticket.findOne({ _id: t }));
  // * });
  // * const queryObj = { reporter: req.userID };
  // * const allTickets = await Ticket.find(queryObj);

  // * res.status(200).send(ObjectConverter.ticketListResponse(ticketList));

  const ticketList = await Ticket.find(queryObj);

  res.status(200).send(ObjectConverter.ticketListResponse(ticketList));
};

/*
 * Controller to fetch ticket based on id
 */
exports.getOneTicket = async (req, res) => {
  const ticket = await Ticket.findOne({
    _id: req.params.id,
  });
  res.status(200).send(ObjectConverter.ticketResponse(ticket));
};

/*
 * Controller to update the ticket
 */
exports.updateTicket = async (req, res) => {
  //* check if the ticket exists

  const ticket = await Ticket.findOne({
    _id: req.params.id,
  });
  if (ticket == null) {
    return res.status(200).send({
      message: "Ticket doesn't exist!!!",
    });
  }

  /*
   * Only the ticket requestor can update the ticket
   */
  const user = await User.findOne({
    userID: req.userID,
  });

  /*
   * If the ticket is not assigned to any engineer
   */
  if (ticket.assignee == undefined) {
    ticket.assignee = req.userID;
  }

  if (
    (user.ticketsCreated == undefined ||
      !user.ticketsCreated.includes(req.params.id)) &&
    !(user.userType == constants.userType.admin) &&
    !(ticket.assignee == req.userID)
  ) {
    return res.status(403).send({
      message: "Only the owner of the ticket can update the ticket.",
    });
  }
  //* Update the attributes of the saved ticket

  ticket.title = req.body.title != undefined ? req.body.title : ticket.title;
  ticket.description =
    req.body.description != undefined
      ? req.body.description
      : ticket.description;
  ticket.ticketPriority =
    req.body.ticketPriority != undefined
      ? req.body.ticketPriority
      : ticket.ticketPriority;
  ticket.status =
    req.body.status != undefined ? req.body.status : ticket.status;

  //* Ability to re-assign the ticket
  if (user.userType == constants.userType.admin) {
    ticket.assignee =
      req.body.assignee != undefined ? req.body.assignee : ticket.assignee;
  }

  //* Save the changed the ticket

  const updatedTicket = await ticket.save();

  const engineer = await User.findOne({
    userID: updatedTicket.assignee,
  });

  const owner = await User.find({
    userID: updatedTicket.reporter,
  });

  if (user.userType == constants.userType.admin)
    notificationServiceClient(
      updatedTicket._id,
      "Updated your ticket : " + updatedTicket._id,
      updatedTicket.description,
      engineer.email + "," + owner.email + "," + user.email,
      user.email
    );
  else
    notificationServiceClient(
      updatedTicket._id,
      "Updated your ticket : " + updatedTicket._id,
      updatedTicket.description,
      engineer.email + "," + owner.email,
      user.email
    );

  //* Return the updated ticket

  return res.status(200).send(ObjectConverter.ticketResponse(updatedTicket));
};
