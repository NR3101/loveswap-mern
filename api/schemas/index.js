import { z } from "zod";

// signup schema with input sanitization
export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be less than 30 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  age: z.coerce
    .number()
    .min(18, { message: "You must be at least 18 years old" }),
  gender: z.enum(["male", "female"], { message: "Invalid gender" }),
  genderPreference: z.enum(["male", "female", "both"], {
    message: "Invalid gender preference",
  }),
});

// login schema with input sanitization
export const loginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email({
    message: "Invalid email address",
  }),
  password: z.string({ required_error: "Password is required" }),
});

// update profile schema
export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(30, { message: "Name must be less than 30 characters" })
    .optional(),
  bio: z.string({ required_error: "Bio is required" }).optional(),
  age: z.coerce
    .number()
    .min(18, { message: "You must be at least 18 years old" })
    .optional(),
  gender: z.enum(["male", "female"], { message: "Invalid gender" }).optional(),
  genderPreference: z
    .enum(["male", "female", "both"], {
      message: "Invalid gender preference",
    })
    .optional(),
  image: z.string().optional(),
});
