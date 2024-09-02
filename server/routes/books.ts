// booksRouter.ts

import express from "express";

import {
  validateBookJsonBody,
  parseQueryParameters,
  validateQueryParameters,
} from "../middleware/bookMiddlewares";

import {
  addBookHandler,
  getBookHandler,
  deleteBookByIdHandler,
  getBookByIdHandler,
  getBookByIsbnHandler,
  getBookByTitleHandler,
} from "../handlers/bookHandler";
import { roleBasedAuthorizationMiddleware } from "../middleware/authenticationMiddleware";
import { Roles } from "../../src/user-management/models/user.model";

const booksRouter = express.Router();

// Route to add a new book
booksRouter.post("/", validateBookJsonBody, addBookHandler);

// Route to get books with optional query parameters

// Apply middleware to all routes under the /books
booksRouter.use(
  "/",
  parseQueryParameters,
  // validateQueryParameters
);

// Define the specific routes under the /books prefix
booksRouter.get("/all", getBookHandler);
booksRouter.get("/id/:id", getBookByIdHandler); 
booksRouter.get("/isbn/:isbn", getBookByIsbnHandler);
booksRouter.get("/title/:title", getBookByTitleHandler);


// Route to delete a book by ID
booksRouter.delete("/", roleBasedAuthorizationMiddleware(Roles.Admin), deleteBookByIdHandler);

export default booksRouter;
