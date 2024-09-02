// usersRouter.ts

import express from "express";
import { deleteUserByIdHandler, getUserByIdHandler, getUserByNameHandler, getUserByPhoneNumberHandler, getAllUserHandler } from "../handlers/userHandler";
import { parseQueryParameters } from "../middleware/userMiddlewares";
import { roleBasedAuthorizationMiddleware } from "../middleware/authenticationMiddleware";
import { Roles } from "../../src/user-management/models/user.model";

const usersRouter = express.Router();

// Route to get users

// Apply middleware to all routes under the /users
usersRouter.use(
  "/",
      parseQueryParameters,
    // validateQueryParameters
); 
usersRouter.get("/all", getAllUserHandler);
usersRouter.get("/id/:id", getUserByIdHandler);
usersRouter.get("/phoneNumber/:phoneNumber", getUserByPhoneNumberHandler);
usersRouter.get("/name/:name", getUserByNameHandler);


// Route to delete a user by ID
usersRouter.delete("/", roleBasedAuthorizationMiddleware(Roles.Admin),deleteUserByIdHandler);

export default usersRouter;
