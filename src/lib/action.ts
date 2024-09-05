import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRepository } from "./user-management/user.repository";


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

// Omit `image` for the update
const UpdateUserProfile = UserProfileUpdateSchema.omit({});

// Function to update the user profile
export async function updateProfile(id: number, prevState: State, formData: FormData) {
  const validatedFields = UpdateUserProfile.safeParse({
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
    const result = await userRepo.update(id, updatedData);
  } catch (error) {
    console.log("Database error: Failed to update profile.");
    return { message: "Error: Failed to update profile." };
  }

  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile");
}





// ------------------------------------------------------------------------------------
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";
// import { z } from "zod";
// import { UserRepository } from "@/lib/user-management/user.repository";

// const UpdateUserProfile = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   DOB: z.string().optional().nullable(),
//   phoneNum: z.string().optional().nullable(),
//   address: z.string().optional().nullable(),
// });

// export type State = {
//   errors?: {
//     name?: string[];
//     email?: string[];
//     DOB?: string[];
//     phoneNum?: string[];
//     address?: string[];
//   };
//   message?: string | null;
// };

// export async function updateProfile(prevState: State, formData: FormData) {
//   const id = formData.get("id");
//   if (!id) {
//     return { message: "Error: User ID is missing." };
//   }

//   const validatedFields = UpdateUserProfile.safeParse({
//     name: formData.get("name"),
//     email: formData.get("email"),
//     DOB: formData.get("DOB"),
//     phoneNum: formData.get("phoneNum"),
//     address: formData.get("address"),
//   });

//   if (!validatedFields.success) {
//     return {
//       errors: validatedFields.error.flatten().fieldErrors,
//       message: "Missing fields. Failed to update profile.",
//     };
//   }

//   const { name, email, DOB, phoneNum, address } = validatedFields.data;

//   const updatedData = {
//     name,
//     email,
//     DOB,
//     phoneNum,
//     address,
//   };

//   try {
//     const userRepo = new UserRepository();
//     await userRepo.update(Number(id), updatedData);
//   } catch (error) {
//     console.log("Database error: Failed to update profile.");
//     return { message: "Error: Failed to update profile." };
//   }

//   revalidatePath("/dashboard/profile");
//   redirect("/dashboard/profile");
// }
