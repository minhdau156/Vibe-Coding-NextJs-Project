import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function testDatabaseConnection() {
  console.log("Testing database connection and fetching demo data...\n");
  try {
    // 1. Users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });
    console.log("--- USERS ---");
    console.table(users);
    
    // 2. System Item Types
    const itemTypes = await prisma.itemType.findMany({
      where: { isSystem: true },
      select: { name: true, icon: true, color: true }
    });
    console.log("\n--- SYSTEM ITEM TYPES ---");
    console.table(itemTypes);

    // 3. Collections & Items
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    console.log("\n--- COLLECTIONS ---");
    const collectionData = collections.map(c => ({
      Name: c.name,
      Description: c.description,
      "Item Count": c._count.items
    }));
    console.table(collectionData);

    // 4. Items breakdown
    const items = await prisma.item.findMany({
      include: {
        itemType: true
      }
    });
    
    console.log("\n--- RECENT ITEMS PREVIEW ---");
    const recentItems = items.slice(0, 5).map(item => ({
      Title: item.title,
      Type: item.itemType.name,
      ContentType: item.contentType,
      Language: item.language || 'N/A'
    }));
    console.table(recentItems);

    console.log(`\nFound a total of ${users.length} users, ${itemTypes.length} system types, ${collections.length} collections, and ${items.length} items.`);
    console.log("\nDatabase connection and data verification passed! 🎉");
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testDatabaseConnection();
