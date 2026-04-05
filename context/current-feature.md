# Current Feature: Items List View

## Status

In Progress

## Goals

- Create dynamic route `/items/[type]` (e.g., /items/snippets, /items/notes)
- Fetch and display items filtered by type
- Responsive grid of ItemCard components
- Two columns on medium and up
- Each card has left border colored by item type
- Follow existing codebase patterns

## Notes

- Feature spec from `context/features/item-list-view-spec.md`
- Needs dynamic routing at `/items/[type]`.
- Existing `ItemCard` component should be used/modified to support border colors by type.

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
- Auth Credentials - Email/Password Provider: Completed
- Auth UI - Sign In, Register & Sign Out: Completed
- Email Verification on Register: Completed
