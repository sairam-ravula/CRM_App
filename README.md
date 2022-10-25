# CRM_APP

This project is Node.js back-end code for CRM Application that can create users, tickets and updating tickets. The application has three roles: user, engineer, admin.

•	The user is auto approved. He can create tickets, update his own tickets.

•	The engineer has to be approved by the admin. He can create tickets, update the tickets and can close the tickets.

•	The admin has all the rights on the application.

## Dependencies:
1.	Bcryptjs
2.	Body-parser
3.	Jsonwebtokens
4.	Dotenv
5.	Express
6.	Mongoose
7.	Node-rest-client
## External Application:

1.	Notification service

## Features:
### Account Creation

• You can create accounts for user as well as engineer.

• If the user is a normal customer, the account will automatically be approved on verification. In case of engineer, an admin will have to approve the account.

• JSON Web Token used for authentication.

• Users can also update some details like name, password and email.

• Admin can update additional details like user Type and user Status.

• User search is also available for users with proper authorization.

## Rest API Paths:

### User creation and operations

1.	Sign-up:
POST “/crm/api/v1/auth/signup”

Register with username, password, userID, userType

2.	Sign-in:
POST “/crm/api/v1/auth/signin”

User sign in using userId and password


3.	Get all users:
GET “/crm/api/v1/users”

An admin can get all the users

4.	Get a user by userID
GET “/crm/api/v1/users/:userID”

A user, engineer and admin can get a user by his userID
.
5.	Update a user:
PUT “/crm/api/v1/users/:userID”

An admin can update the details of user and engineer with their userID.

### Ticket creation and operations:
1.	Create a ticket:

POST “/crm/api/v1/tickets”

A user can create a ticket with subject, description and Priority

2.	Get a ticket:
GET “/crm/api/v1/tickets/:id”

Any one can get the tickets details using ticket ID.

3.	Get all tickets:
GET “/crm/api/v1/tickets”

An engineer and admin can get all the tickets assigned to him.

4.	Update the ticket:
PUT “/crm/api/v1/tickets/:id”

An engineer and admin can update the ticket using its ticket ID.

# Notification Service:

•	User and engineer will get email notifications upon creation and updating the tickets.

•	Both CRM_App and Notification Service App will talk to each other using node-rest-client.

•	The app made use of CRON jobs to schedule the email notification.
