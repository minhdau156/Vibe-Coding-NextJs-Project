# Current Feature: Auth Setup - NextAuth + GitHub Provider

## Status

In Progress

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Set up split auth config pattern for edge compatibility
- Add GitHub OAuth provider
- Protect `/dashboard/*` routes using Next.js 16 proxy
- Redirect unauthenticated users to sign-in
- Create necessary NextAuth config files: auth.config.ts, auth.ts, route.ts, proxy.ts, next-auth.d.ts

## Notes

**Overview**: Set up NextAuth v5 with Prisma adapter and GitHub OAuth. Use NextAuth's default pages for testing.

**Key Gotchas**:
- Use Context7 to verify the newest config and conventions.
- Use `next-auth@beta` (not `@latest` which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`)
- Use named export: `export const proxy = auth(...)` not default export
- Use `session: { strategy: 'jwt' }` with split config pattern
- Don't set custom `pages.signIn` - use NextAuth's default page

## History

- Database Setup & Prisma 7 Migration: Completed
- Dashboard UI Phase 1: Completed
- Dashboard UI Phase 2: Completed
- Dashboard UI Phase 3: Completed
- Database Seeding: Completed
- Dashboard Collections Data: Completed
- Dashboard Items Data: Completed
- Dashboard Stats & Sidebar: Completed
