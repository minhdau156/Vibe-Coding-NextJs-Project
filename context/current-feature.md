# Current Feature: Item Drawer

## Status

In Progress

## Goals

- Implement right-side slide-in drawer using shadcn Sheet component.
- Clicking an ItemCard opens the drawer with item details; functions on the dashboard and items list.
- Display an action bar featuring Favorite (star icon), Pin, Copy, Edit (pencil icon), and Delete (right-aligned trash icon).
- Construct a client wrapper component to control the drawer's state.
- Create `/api/items/[id]` API route to fetch full item data concurrently on click (with an auth check).
- Implement a fallback skeleton/loading state while fetching details.

## Notes

- See `context/screenshots/dashboard-ui-drawer.png` for reference.
- Query logic to fetch full info lives in `lib/db/items.ts`.
- There is no separate item page, the drawer is the singular item view. Avoid item-specific stuff (like code editors) until a later phase; for now frame only the item's info.


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
- Items List View: Completed
- Three Column Item Listing: Completed
