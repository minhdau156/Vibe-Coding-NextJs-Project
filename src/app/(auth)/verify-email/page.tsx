import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return (
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 items-center">
          <XCircle className="w-12 h-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Missing Token</CardTitle>
          <CardDescription className="text-center">
            No verification token was provided in the URL.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/sign-in" className={cn(buttonVariants(), "w-full")}>Back to Sign In</Link>
        </CardFooter>
      </Card>
    );
  }

  // Find verification token
  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return (
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 items-center">
          <XCircle className="w-12 h-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Invalid Token</CardTitle>
          <CardDescription className="text-center">
            The verification token is invalid or has already been used.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/sign-in" className={cn(buttonVariants(), "w-full")}>Back to Sign In</Link>
        </CardFooter>
      </Card>
    );
  }

  // Check if token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return (
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 items-center">
          <XCircle className="w-12 h-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Token Expired</CardTitle>
          <CardDescription className="text-center">
            Your verification token has expired. Please register again to get a new token.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/register" className={cn(buttonVariants(), "w-full")}>Register Again</Link>
        </CardFooter>
      </Card>
    );
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.identifier },
  });

  if (!existingUser) {
    return (
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-1 items-center">
          <XCircle className="w-12 h-12 text-destructive mb-4" />
          <CardTitle className="text-2xl font-bold tracking-tight text-center">User Not Found</CardTitle>
          <CardDescription className="text-center">
            The user associated with this token no longer exists.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link href="/register" className={cn(buttonVariants(), "w-full")}>Register Again</Link>
        </CardFooter>
      </Card>
    );
  }

  // Update user as verified
  await prisma.user.update({
    where: { email: existingToken.identifier },
    data: {
      emailVerified: new Date(),
    },
  });

  // Delete the token so it can't be reused
  await prisma.verificationToken.delete({
    where: { token: existingToken.token },
  });

  return (
    <Card className="w-full max-w-md shadow-lg border-green-500/20">
      <CardHeader className="space-y-1 items-center">
        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
        <CardTitle className="text-2xl font-bold tracking-tight text-center text-green-500">Email Verified!</CardTitle>
        <CardDescription className="text-center">
          Your email has been successfully verified. You can now sign in to your account.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center">
        <Link href="/sign-in" className={cn(buttonVariants(), "w-full bg-green-600 hover:bg-green-700 text-white")}>Sign In Now</Link>
      </CardFooter>
    </Card>
  );
}
