# Current Feature: Auth Credentials - Email/Password Provider

## Status

In Progress

## Goals

- Use bcryptjs for hashing
- Add password field to User model via migration if not already there
- Update `auth.config.ts` with Credentials provider placeholder
- Update `auth.ts` to override Credentials with bcrypt validation
- Create registration API route at `/api/auth/register`

## Notes

**Overview**: Add Credentials provider for email/password authentication with registration.

**Registration API Route (`POST /api/auth/register`)**:
- Accept: name, email, password, confirmPassword
- Validate passwords match
- Check if user already exists
- Hash password with bcryptjs
- Create user in database

**Credentials Provider in Split Pattern**:
- `auth.config.ts`: Add Credentials provider with `authorize: () => null` placeholder
- `auth.ts`: Override the Credentials provider with actual bcrypt validation logic

**Testing Instructions**:
1. Test registration via curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123","confirmPassword":"password123"}'
```
2. Go to `/api/auth/signin`
3. Sign in with email/password
4. Verify redirect to `/dashboard`
5. Verify GitHub OAuth still works

**References**:
- Credentials provider: https://authjs.dev/getting-started/authentication/credentials

## History

- Database Setup & Prisma 7 Migration: Completed
- Dashboard UI Phase 1: Completed
- Dashboard UI Phase 2: Completed
- Dashboard UI Phase 3: Completed
- Database Seeding: Completed
- Dashboard Collections Data: Completed
- Dashboard Items Data: Completed
- Dashboard Stats & Sidebar: Completed
- Auth Setup - NextAuth + GitHub Provider: Completed
