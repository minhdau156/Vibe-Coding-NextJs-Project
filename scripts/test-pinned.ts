import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { getPinnedItems } from "../src/lib/db/items";

async function main() {
  const pinned = await getPinnedItems();
  console.log("Pinned Items:", pinned);
}
main();
