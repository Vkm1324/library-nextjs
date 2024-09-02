import { Request, Response, NextFunction } from "express";
import { title } from "node:process";

// Middleware to validate user JSON body
export async function validateUserJsonBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.method === "POST" || req.method === "PATCH") {
    try {
      // Validate the parsed body
      const validationResult = validateRequestBody(req.body);
      if (validationResult.isValid) {
        console.log("validateUserJsonBody completed");
        next();
      } else {
        res.status(400).json(`Error : ${validationResult.errors.join(",")}` );
        console.log("validateUserJsonBody failed");
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid JSON by validateUserJsonBody" });
      console.log("validateUserJsonBody failed", error);
    }
  } else {
    next();
  }
}

// Function to validate the request body
const validateRequestBody = (body: any) => {
  console.log("validating RequestBody started");
  const requiredFields = [
    { key: "name", type: "string" },
    { key: "age", type: "number" },
    { key: "DOB", type: "string" }, // Date should be a string or Date object
    { key: "address", type: "string" },
    { key: "phoneNum", type: "number" },
    { key: "password", type: "string" },
    { key: "email", type: "string" },
  ];

  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!body.hasOwnProperty(field.key)) {
      errors.push(`${field.key} is missing`);
    } else if (typeof body[field.key] !== field.type) {
      errors.push(`${field.key} must be of type ${field.type}`);
    }
  }
  console.log("validating RequestBody completed");
  return { isValid: errors.length === 0, errors };
};
 
// Middleware to parse query parameters
export function parseQueryParameters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Original URL:", req.originalUrl); // Debugging: log the original URL
    console.log("Host:", req.headers.host); // Debugging: log the host

    const url = new URL(req.originalUrl, `http://${req.headers.host}`);

    console.log("Parsed URL:", url.href); // Debugging: log the fully parsed URL

    req.query = {
      name: url.searchParams.get("name"),
      id: url.searchParams.get("uid"),
      phoneNumber: url.searchParams.get("phoneNumber"),
    };

    console.log("Query parameters:", req.query); // Debugging: log the parsed query parameters

    next();
  } catch (error) {
    console.error("Error parsing URL:", error); // Debugging: log the error if parsing fails
    res.status(400).json({ message: "Invalid URL" });
  }
}
