// transactionsRouter.ts

import express from "express";
import {
  createTransactionHandler,
  getTransactionByUserIdHandler,
  updateReturnStatusHandler,
} from "../handlers/transactionHandler";
import { parseQueryParameters } from "../middleware/userMiddlewares";

const transactionRouter = express.Router();

// Route to create a new transaction
transactionRouter.post("/create", createTransactionHandler);
// router to list all transactions of user
transactionRouter.get(
  "/uid/:id",
  parseQueryParameters,getTransactionByUserIdHandler
);
// Route to update the return status of a transaction
transactionRouter.patch("/return", updateReturnStatusHandler);

export default transactionRouter;
