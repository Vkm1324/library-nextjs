import { Request, Response, NextFunction } from "express";
 import { TransactionRepository } from "../../src/transaction/transaction.repository";

const transactionRepository = new TransactionRepository();

export const createTransactionHandler = async (req: Request, res: Response) => {
  if (req.method === "POST" && req.path === "/transaction/create") {
    try {
      console.log("createTransaction started");

      const body = req.body;
      const createdTransaction = await transactionRepository.create(body);

      if (createdTransaction === null) {
        res.status(400).json({ message: "Failed to create transaction" });
        return;
      }

      res.status(201).json({
        message: "Transaction created successfully",
        createdTransaction,
      });
    } catch (error) {
      console.error("Error creating transaction:", error.message);
      res.status(400).json({
        message: "Error creating transaction",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export const updateReturnStatusHandler = async (
  req: Request,
  res: Response
) => {
  if (req.method === "PATCH" && req.path.startsWith("/transaction/return")) {
    try {
      console.log("updateReturnStatus started");

      const transactionId = req.body.transactionId;

      if (isNaN(Number(transactionId))) {
        res.status(400).json({ message: "Invalid transaction ID" });
        return;
      }

      const updatedTransaction = await transactionRepository.updateReturnStatus(
        transactionId
      );

      if (!updatedTransaction) {
        res
          .status(404)
          .json({ message: "Transaction not found or could not be updated" });
        return;
      }

      res.status(200).json({
        message: "Transaction return status updated successfully",
        updatedTransaction,
      });
    } catch (error) {
      console.error("Error updating return status:", error.message);
      res.status(400).json({
        message: "Error updating return status",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export const getTransactionByUserIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (id) {
      const user = await transactionRepository.getByUserId(Number(id));
      if (user) {
        // console.log(user);
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "No User transactions" });
      }
    } else {
      res.status(400).json({ message: "Missing id parameter" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};