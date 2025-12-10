import z from "zod";

export const inviteMemberSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string({ message: "Email is required" })
    .email("Please enter a valid email address"),
});

export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>;
