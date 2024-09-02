import express from "express";
import "./handlers/passportHandler";
import {
  parseBody,
  requestLogger,
} from "./middleware/appMiddlewares";
import { validateUserJsonBody } from "./middleware/userMiddlewares";
import { authenticateMiddleware } from "./middleware/authenticationMiddleware";
import cors from "cors";
import cookieParser from "cookie-parser";
// import routes 
import booksRouter from "./routes/books";
import usersRouter from "./routes/users";
import transactionsRouter from "./routes/transaction";
import { createUserHandler } from "./handlers/userHandler";
import { refreshTokenHandler, logoutUserHandler, loginUserHandler, logoutUserFromAllDevicesHandler, blacklistUserHandler, isUserBlacklistedHandler, unblacklistUserHandler } from "./handlers/authenticationHandler";
 
//Express application
const app = express();

// Set application-specific middlewares
app.use(requestLogger, parseBody);
app.use(cors({ origin: "http://127.0.0.1:5173", credentials: true }));

//  cookie parse 
app.use(cookieParser());

app.use("/books", booksRouter);

// register new users
app.post("/users", validateUserJsonBody, createUserHandler);
app.post("/login",
  // isUserBlacklistedHandler,
  loginUserHandler);

// refresh 
app.get("/refresh", refreshTokenHandler);

// authentication middleware
app.use(authenticateMiddleware);

// authentication middleware will be added to all the below routes

// logout
app.get("/logout", logoutUserHandler);

// log out all devices
app.get("/logoutalldevices", logoutUserFromAllDevicesHandler);
// blacklist user
app.get("/blacklist", blacklistUserHandler);
// unblacklist user
app.get("/unblacklist", unblacklistUserHandler);

// Routes

app.use("/users", usersRouter);
app.use("/transaction", transactionsRouter);


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

