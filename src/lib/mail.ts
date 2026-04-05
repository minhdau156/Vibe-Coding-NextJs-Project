export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  console.log("Mock email sent:");
  console.log(`To: ${email}`);
  console.log(`Subject: Confirm your email`);
  console.log(`Body: Click here to confirm your email: ${confirmLink}`);

  return { success: true };
}
