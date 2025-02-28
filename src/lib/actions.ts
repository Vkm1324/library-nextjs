"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { update, UserRepository } from "./user-management/user.repository";
import { BookRequestRepository } from "./book-requests/book-request.repository";
import { IBookResquest } from "./book-requests/models/books-request.model";
import { TransactionRepository } from "./transaction/transaction.repository";
import { BookRepository } from "./book-management/books.repository"; 
import { ProfessorRepository } from "./professors/professors.repsitory";
import { getRole } from "@/middleware";

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
    const transaction = new TransactionRepository();
    const data: Partial<IBookResquest> = { status: "approved" };
    await bookReq.update(id, data);
    const result = await bookReq.getById(id);

    if (result && result.bookId && result.userId) {
      const transactionData = {
        bookId: result.bookId,
        userId: result.userId,
      };
      // Create the transaction
      await transaction.create(transactionData);
    } else {
      throw new Error("Failed to retrieve book request or required data");
    }

    revalidatePath("/dashboard/request");
    return { message: "Request approved successfully." };
  } catch (error) {
    console.error("Error approving request:", error);
    return { message: "Database Error: Failed to approve request." };
  }
}

export async function requestBook(uid: number, bookid: number) {
  const reqbook = new BookRequestRepository();
  const result = await reqbook.create({
    userId: uid,
    bookId: bookid,
    requestDate: new Date(),
  });
  if (result) {
    return `Request has been loadged succesfully for book Id:  ${result.bookId}`;
  } else {
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
  phoneNum: z.coerce.number().int().min(1000000000, {
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
export async function updateProfile(
  id: number,
  prevState: State,
  formData: FormData
) {
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
  redirect("/dashboard/admin/users");
}

export async function deleteUser(id: number) {
  try {
    const prof = new ProfessorRepository();
    prof.delete(id);
    const user = new UserRepository();
    const userData=await user.delete(id);
    revalidatePath("/dashboard/users");
    return { message: `Deleted ${userData?.name} who was a ${getRole(userData?.role)} `  };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}

// Define the schema for creating a user
const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  // role: z.enum(["editor", "admin", "user"], {
  //   invalid_type_error: "Please select a valid role.",
  // }),
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
  message: string;
};

// Create user function
export async function createUser(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedCreateUserFields = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image: formData.get("image"),
    role: formData.get("role"),
    DOB: formData.get("DOB"),
    phoneNum: formData.get("phoneNum"),
    address: formData.get("address"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedCreateUserFields.success) {
    return {
      errors: validatedCreateUserFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }

  // Prepare data for insertion into the database
  const data = validatedCreateUserFields.data;
  const newUser = {
    ...data,
    DOB: new Date(data.DOB!),
    phoneNum: +data.phoneNum!,
    address: data.address!,
    image: "",
    id:null,
  };
  // Insert data into the database
  try {
    const userRepo = new UserRepository();
    const result = await userRepo.create(newUser);
    // return { message: "Success" };
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create User.",
    };
  }
  // Revalidate the cache for the users page and redirect the user.
  revalidatePath("/dashboard/admin/users");
  redirect("/dashboard/admin/users");
}

export async function updateTransaction(id: number) {
  try {
    const user = new TransactionRepository();
    await user.updateReturnStatus(+id);
    revalidatePath("/dashboard/admin/transaction");
    return { message: "Deleted user ." };
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}
export async function dueList(issueddate: Date) {
  try {
    const user = new TransactionRepository();
    const dueList= await user.getByIssuedDate(issueddate);
    revalidatePath("/dashboard/admin/transaction");
    return dueList;
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}
// Zod validation schema for updating book details
const BookUpdateSchema = z.object({
  title: z.string().min(1, { message: "Please enter a valid title." }),
  author: z.string().min(1, { message: "Please enter a valid author." }),
  publisher: z.string().min(1, { message: "Please enter a valid publisher." }),
  genre: z.string().min(1, { message: "Please enter a valid genre." }),
  isbnNo: z.coerce
    .number()
    .min(1000000000, { message: "Please enter a valid ISBN number." })
    .refine((isbnNo) => String(isbnNo).length === 13, {
      message: "ISBN number should be 13 digits long.",
    }),
  numofPages: z.coerce
    .number()
    .min(1, { message: "Enter a valid page count." }),
  price: z.coerce
    .number()
    .min(1, { message: "Enter a valid Price." }),
  totalNumberOfCopies: z.coerce.number().min(1, {
    message: "Enter a valid total copy count.",
  }),
  availableNumberOfCopies: z.coerce.number().min(0, {
    message: "Enter a valid available copy count.",
  }),
  image: z.string().url().optional(), // Ensure image is a valid URL if provided
});

export type BookState = {
  errors?: {
    title?: string[];
    price?: string[];
    author?: string[];
    publisher?: string[];
    genre?: string[];
    isbnNo?: string[];
    numofPages?: string[];
    totalNumberOfCopies?: string[];
    availableNumberOfCopies?: string[];
    image?: string[]; // Adjust for image URL errors
  };
  message?: string | null;
};

// Function to update book details
export async function updateBook(
  id: number,
  prevState: BookState,
  formData: FormData
) {
  const validatedFields = BookUpdateSchema.safeParse({
    title: formData.get("title"),
    price: formData.get("price"),
    author: formData.get("author"),
    publisher: formData.get("publisher"),
    genre: formData.get("genre"),
    isbnNo: formData.get("isbnNo"),
    numofPages: formData.get("numofPages"),
    totalNumberOfCopies: formData.get("totalNumberOfCopies"),
    availableNumberOfCopies: formData.get("availableNumberOfCopies"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to update book.",
    };
  }

  const {
    title,
    author,
    publisher,
    genre,
    isbnNo,
    numofPages,
    totalNumberOfCopies,
    availableNumberOfCopies,
    image,
    price,
  } = validatedFields.data;

  const updatedData = {
    title,
    price,
    author,
    publisher,
    genre,
    isbnNo,
    numofPages,
    totalNumberOfCopies,
    availableNumberOfCopies,
    image,
  };

  try {
    //   const { edgestore } = useEdgeStore();
    // await edgestore.publicFiles.confirmUpload(image);
    const bookRepo = new BookRepository();
    await bookRepo.update(id, updatedData);
  } catch (error) {
    console.log("Database error: Failed to update book.");
    return { message: "Error: Failed to update book." };
  }

  revalidatePath("/dashboard/admin/books");
  redirect("/dashboard/admin/books");
}

export async function deleteBook(id: number) {
  try {
    const Book = new BookRepository();
    const book = await Book.delete(+id);
    revalidatePath("/dashboard/admin/books");
    return { message: `Deleted book .${book?.title}` };
  } catch (error) {
    return { message: "Database Error: Failed to Delete book." };
  }
}
// Zod validation schema for professor profile update (omit image)
const ProfessorProfileUpdateSchema = z.object({
  name: z.string({
    invalid_type_error: "Please enter a valid name.",
  }),
  email: z.string().email("Please enter a valid email address."),
  DOB: z.coerce.date({
    invalid_type_error: "Please enter a valid date of birth.",
  }),
  phoneNum: z.coerce.number().int().min(1000000000, {
    message: "Please enter a valid 10-digit phone number.",
  }),
  address: z.string({
    invalid_type_error: "Please enter a valid address.",
  }),
  bio: z.string().min(1, "Please enter a bio."), // Bio validation
  link: z.string().url("Please enter a valid URL."), // Link validation
  deptId: z.coerce
    .number()
    .int({ message: "Please enter a valid department number." }), // Department validation
});

// Updated State type with new fields
export type ProfessorState = {
  errors?: {
    name?: string[];
    email?: string[];
    DOB?: string[];
    phoneNum?: string[];
    address?: string[];
    bio?: string[];
    link?: string[];
    deptId?: string[];
  };
  message?: string | null;
};

// Function to update the professor profile
export async function updateProfessorProfile(
  id: number,
  prevState: ProfessorState,
  formData: FormData
) {
  const validatedFields = ProfessorProfileUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    DOB: formData.get("DOB"),
    phoneNum: formData.get("phoneNum"),
    address: formData.get("address"),
    bio: formData.get("bio"),
    link: formData.get("link"),
    deptId: formData.get("department"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing or invalid fields. Failed to update profile.",
    };
  }

  const { name, email, DOB, phoneNum, address, bio, link, deptId } =
    validatedFields.data;

  const updatedData = {
    
    name,
    email,
    DOB,
    phoneNum,
    address,
    bio,
    link,
    deptId,
  };

  try {
    const professorRepo = new ProfessorRepository();
    const userRepo = new UserRepository();
    await userRepo.update(id, updatedData);
    await professorRepo.update(id, updatedData);
  } catch (error) {
    console.log("Database error: Failed to update profile.");
    return { message: "Error: Failed to update profile." };
  }

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/admin/professors");
}

export async function getScheduledEvents(invitee_email: string) { 
  try {
    const userResponse = await fetch("https://api.calendly.com/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALENDLY_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Error fetching user info: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    const organizationUri = userData.resource.current_organization;

    const eventsResponse = await fetch(
      `https://api.calendly.com/scheduled_events?organization=${organizationUri}&invitee_email=${invitee_email}&status=active`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALENDLY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!eventsResponse.ok) {
      console.error("Error response:", await eventsResponse.text());
      throw new Error(
        `Error fetching scheduled events: ${eventsResponse.statusText}`
      );
    }

    const eventsData = await eventsResponse.json(); 
    const events = eventsData.collection;
    const eventsDetails = await Promise.all(
      events
        .filter((event: any) => new Date(event.start_time) > new Date())
        .map(async (event: any) => {
          const meetLink = event.location?.join_url || "No Meet link";
          const eventUUID = event.uri.split("/").pop();
          const invitees = await getInviteeDetails(eventUUID);
          const organizers = event.event_memberships.map((membership: any) => ({
            name: membership.user_name,
            email: membership.user_email,
          }));
          const currentInvitee = invitees.filter(
            (invitee: any) => invitee.email === invitee_email
          );
          return {
            event: event.name,
            status: event.status,
            start_time: event.start_time,
            end_time: event.end_time,
            meetLink: meetLink,
            cancelLink: currentInvitee[0].cancel_url,
            rescheduleLink: currentInvitee[0].reschedule_url,
            organizers,
            invitees: invitees.map((invitee: any) => ({
              name: invitee.name,
              email: invitee.email,
            })),
          };
        })
    );
    return eventsDetails;

  } catch (error) {
    console.error("Error fetching scheduled events", error);
    throw error;
  }
}

export async function getInviteeDetails(event_uuid: string) {
  try {
    const response = await fetch(
      `https://api.calendly.com/scheduled_events/${event_uuid}/invitees`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALENDLY_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error fetching invitees:", errorText);
      throw new Error(`Error fetching invitees: ${response.statusText}`);
    }

    const data = await response.json();
    return data.collection; // List of invitees
  } catch (error) {
    console.error("Error fetching invitee details", error);
    throw error;
  }
}
