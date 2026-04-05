# DevStash Item Types Research

DevStash supports 7 core system item types that determine how content is classified, stored, and displayed. This document details each type and their characteristics based on the project overview, database schema, and seed data.

## The 7 System Item Types

### 1. Snippet (`snippet`)
- **Icon**: `Code`
- **Color**: `#3b82f6` (Blue)
- **Purpose**: Storing code patterns, reusable functions, and code blocks.
- **Content Type Classification**: `TEXT`
- **Key Fields Used**: `title`, `description`, `content` (holds the exact code), `language` (for syntax highlighting)
- **Route**: `/items/snippets`

### 2. Prompt (`prompt`)
- **Icon**: `Sparkles`
- **Color**: `#8b5cf6` (Purple)
- **Purpose**: Saving AI prompts, system messages, and workflow automations (e.g., Code Review Assistant).
- **Content Type Classification**: `TEXT`
- **Key Fields Used**: `title`, `description`, `content` (holds the prompt text)
- **Route**: `/items/prompts`

### 3. Command (`command`)
- **Icon**: `Terminal`
- **Color**: `#f97316` (Orange)
- **Purpose**: Useful terminal/shell commands for everyday development.
- **Content Type Classification**: `TEXT`
- **Key Fields Used**: `title`, `description`, `content` (holds the CLI command), `language` (typically `'bash'`)
- **Route**: `/items/commands`

### 4. Note (`note`)
- **Icon**: `StickyNote`
- **Color**: `#fde047` (Yellow)
- **Purpose**: General markdown notes, scratchpads, and human-readable text.
- **Content Type Classification**: `TEXT`
- **Key Fields Used**: `title`, `description`, `content` (holds markdown text)
- **Route**: `/items/notes`

### 5. File (`file`)
- **Icon**: `File`
- **Color**: `#6b7280` (Gray)
- **Purpose**: Uploaded context files, PDFs, system logs, or general documents. *(Pro-only feature)*
- **Content Type Classification**: `FILE`
- **Key Fields Used**: `title`, `description`, `fileUrl` (Cloudflare R2 URL), `fileName` (original name), `fileSize` (bytes)
- **Route**: `/items/files`

### 6. Image (`image`)
- **Icon**: `Image`
- **Color**: `#ec4899` (Pink)
- **Purpose**: Uploaded image assets, screenshots, or diagrams. *(Pro-only feature)*
- **Content Type Classification**: `FILE`
- **Key Fields Used**: `title`, `description`, `fileUrl` (Cloudflare R2 URL), `fileName`, `fileSize`
- **Route**: `/items/images`

### 7. Link (`link`)
- **Icon**: `Link`
- **Color**: `#10b981` (Emerald)
- **Purpose**: Browser bookmarks, useful resources, and documentation links.
- **Content Type Classification**: `URL`
- **Key Fields Used**: `title`, `description`, `url` (the external link)
- **Route**: `/items/links`

---

## Summaries & Classifications

### Content Type Classification (Text vs File vs URL)
The underlying database `Item` model uses an Enum `ContentType` to strictly differentiate how the item payload is stored:

1. **`TEXT` Types** (Snippet, Prompt, Command, Note):
   - Leverage the `content` field (`@db.Text`) to store raw string data.
   - Typically support markdown editing and rely on the `language` field for syntax highlighting in some instances (mostly `snippet` and `command`).
2. **`FILE` Types** (File, Image):
   - Do not use the `content` field.
   - Leverage `fileUrl`, `fileName`, and `fileSize` to reference objects stored in cloud storage (Cloudflare R2).
   - Restricted to Pro-tier users only.
3. **`URL` Type** (Link):
   - Heavily relies on the `url` field to store external web addresses.
   - Allows users to curate resources without copying content.

### Shared Properties
Regardless of the type, every Item shares common relational and organizational properties:
- **Identification & Meta**: `id`, `createdAt`, `updatedAt`, `userId`, `itemTypeId`
- **Metadata**: `title`, `description`
- **State Flags**: `isFavorite`, `isPinned`
- **Relationships**: Can be associated with `User`, `ItemType`, multiple `Collection`s (many-to-many through `ItemCollection`), and multiple `Tag`s.

### Display Differences
- Each type maps to a distinct **Icon** and **Hex Color** to provide immediate visual context in dashboards and sidebars.
- Type categorization directs traffic to specific localized routes (e.g., `/items/snippets` vs `/items/links`).
- Certain UI elements behave differently depending on the classification. For example, text modes provide a markdown editor, file modes provide a file upload dropzone, and link modes provide an external URL input.
