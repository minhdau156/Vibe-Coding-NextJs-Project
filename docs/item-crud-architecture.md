# Item CRUD Architecture

This document describes the unified CRUD architecture for all 7 DevStash item types (Snippet, Prompt, Command, Note, File, Image, Link). The system leverages shared actions, modular data fetchers, and dynamic routing to power a consistent experience across all assets.

---

## 1. File Structure

### Mutations (Server Actions)
**`src/actions/items.ts`**
A single unified action file for all mutation logic. It will export unified actions (e.g., `createItem`, `updateItem`, `deleteItem`) that handle validation, database interaction via Prisma, and route revalidation.

### Data Fetching
**`src/lib/db/items.ts`**
A dedicated module containing helper functions for reading data directly from the server components, ensuring type safety and code reuse. Examples:
- `getItemsByType(itemTypeId: string)`
- `getItemById(itemId: string)`
- `getRecentItems()`

### Routing
**`src/app/(dashboard)/items/[type]/page.tsx`**
A single dynamic route that handles displaying the dashboard for any of the 7 types. The `[type]` route parameter (e.g., `/items/snippets`) drives the contextual data fetching.

### UI Components
**`src/components/items/`**
- `item-list.tsx`: unified data table or grid displaying a list of items
- `item-card.tsx` / `item-row.tsx`: common layout for an item, rendering dynamically based on its `contentType`
- `unified-item-form.tsx`: A single form that handles the core fields (`title`, `description`, `itemTypeId`, `collectionIds`).
- `editors/`: Sub-components that handle type-specific inputs (e.g., Markdown vs Upload Dropzone vs URL Input).

---

## 2. Dynamic Routing: `/items/[type]`

The dynamic route uses the `[type]` parameter to contextually adapt the entire page:
1. **URL Interpretation**: The user navigates to `/items/[type]`. (e.g., `/items/commands`).
2. **Metadata Lookup**: The page checks the static `ITEM_TYPE_ICONS` / `ITEM_TYPE_COLORS` from `/src/lib/constants.tsx` and the database `ItemType` entity to resolve metadata.
3. **Data Fetching**: The Server Component calls `getItemsByType(resolvedTypeId)` from `src/lib/db/items.ts` to fetch just that subset of data.
4. **Rendering**: The page passes the items and the `type` metadata into the shared presentation components.

---

## 3. Type-Specific Logic

### Backend (Actions) Remain Agnostic
The server actions in `src/actions/items.ts` remain completely **agnostic** to the specific item type. Since the underlying `Item` schema natively supports nullable fields for all variations (e.g., `content`, `url`, `fileUrl`), the action simply accepts a unified schema (e.g. via Zod) and pushes data to Prisma.

### Frontend (Components) Handle Adaptations
Type-specific logic lives entirely in the UI components. Based on the item's `contentType` classification (`TEXT`, `FILE`, `URL`), the generic `unified-item-form.tsx` delegates the "payload" input field to specific editors:

- **`TEXT`**: Renders `editors/markdown-editor.tsx` attached to the `content` form field. Used by Snippets, Prompts, Notes, and Commands. (Snippets/Commands may also trigger an additional `language` selector).
- **`FILE`**: Renders `editors/file-upload.tsx` attached to an upload action payload, returning `fileUrl`, `fileName` and `fileSize`. Used by File and Image.
- **`URL`**: Renders `editors/link-input.tsx` attached to the `url` field. Used by Links.

### Display Responsibilities
Similarly, `item-card.tsx` behaves fully generically until rendering the content preview:
- A Snippet/Command will render a Syntax Highlighter block inline.
- An Image will render a thumbnail preview.
- A Link will render an external `<a>` tag with standard link formatting.

By restricting all divergent logic to the presentation layer, the fundamental CRUD piping of Next.js Server Actions and Prisma remains fully streamlined and significantly easier to maintain.
