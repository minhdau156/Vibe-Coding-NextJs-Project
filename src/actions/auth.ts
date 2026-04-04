"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginAction(state: any, formData: FormData) {
  try {
    formData.append("redirectTo", "/dashboard");
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function githubLoginAction() {
  await signIn("github", { redirectTo: "/dashboard" });
}
