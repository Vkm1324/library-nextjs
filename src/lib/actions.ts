"use server"

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { update, UserRepository } from "./user-management/user.repository";
import { BookRequestRepository } from "./book-requests/book-request.repository";
import { IBookResquest } from "./book-requests/models/books-request.model";

export async function reject(id: number) {
  try {
    const bookReq = new BookRequestRepository();
    const data: Partial<IBookResquest> = { status: "rejected" };
    await bookReq.update(id, data);
    revalidatePath("/dashboard/request");
    return { message: "Request rejected successfully." };
  } catch (error) {
    console.error("Error approving request:", error);
    return { message: "Database Error: Failed to reject request." };
  }
}

export async function approve(id: number) {
  try {
    const bookReq = new BookRequestRepository();
    const data: Partial<IBookResquest> = { status: "approved" };
    await bookReq.update(id, data);
    revalidatePath("/dashboard/request");
    return { message: "Request approved successfully." };
  } catch (error) {
    console.error("Error approving request:", error);
    return { message: "Database Error: Failed to approve request." };
  }
}


export async function requestBook(uid: number, bookid:number) {
  const reqbook = new BookRequestRepository();
  const result = await reqbook.create({
    userId:uid, bookId:bookid,
    requestDate: new Date()
  });
  if (result) {
    return `Request has been loadged succesfully for book Id:  ${result.bookId}`;
  }
  else {
    return "Request failed";
  }
}



// Zod validation schema for user profile update (omit image)
const UserProfileUpdateSchema = z.object({
  name: z.string({
    invalid_type_error: "Please enter a valid name.",
  }),
  email: z.string().email("Please enter a valid email address."),
  DOB: z.coerce.date({
    invalid_type_error: "Please enter a valid date of birth.",
  }),
  phoneNum: z.coerce
    .number()
    .int()
    .min(1000000000, {
      message: "Please enter a valid 10-digit phone number.",
    }),
  address: z.string({
    invalid_type_error: "Please enter a valid address.",
  }),
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    DOB?: string[];
    phoneNum?: string[];
    address?: string[];
  };
  message?: string | null;
};

 
// Function to update the user profile
export async function updateProfile(id: number, prevState: State, formData: FormData) {
  const validatedFields = UserProfileUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    DOB: formData.get("DOB"),
    phoneNum: formData.get("phoneNum"),
    address: formData.get("address"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to update profile.",
    };
  }

  const { name, email, DOB, phoneNum, address } = validatedFields.data;

  const updatedData = {
    name,
    email,
    DOB,
    phoneNum,
    address,
  };
  try {
    const userRepo = new UserRepository();
    await userRepo.update(id, updatedData);
  } catch (error) {
    console.log("Database error: Failed to update profile.");
    return { message: "Error: Failed to update profile." };
  }

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile");
}

 export async function deleteUser(id: number) { 
   try {
     const user = new UserRepository();
     await user.delete(+id);
     revalidatePath("/dashboard/users");
     return { message: "Deleted user ." };
   } catch (error) {
     return { message: "Database Error: Failed to Delete Invoice." };
   }
 }


// Define the schema for creating a user
const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }), 
  role: z.enum(["editor", "admin", "user"], {
    invalid_type_error: "Please select a valid role.",
  }),
  DOB: z.string().optional(),
  phoneNum: z.string().optional(),
  address: z.string().optional(),
});

// Omit fields if needed
const CreateUser = UserSchema.omit({});

// Define the state type for error handling
export type CreateUserState = {
  errors?: {
    name?: string[];
    email?: string[];
    image?: string[];
    role?: string[];
    DOB?: string[];
    phoneNum?: string[];
    address?: string[];
  };
  message?: string | null;
};

// Create user function
export async function createUser(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"), 
    image: formData.get("image"), 
    role: formData.get("role"),
    DOB: formData.get("DOB"),
    phoneNum: formData.get("phoneNum"),
    address: formData.get("address"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  // Prepare data for insertion into the database
  const data =
    validatedFields.data;
  const newUser = { ...data };
  // Insert data into the database
  try {
    const userRepo = new UserRepository();
    await userRepo.create(data);
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create User.",
    };
  }

  // Revalidate the cache for the users page and redirect the user.
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}
 
 