import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function testDatabaseConnection() {
  console.log("Testing database connection...");
  try {
    // Attempt a simple query
    const userCount = await prisma.user.count();
    console.log(`Connection successful! Current number of users: ${userCount}`);
    
    // Also, fetch the item types we seeded
    const itemTypes = await prisma.itemType.findMany();
    console.log(`Found ${itemTypes.length} system item types.`);
    
    console.log("Database connection test passed! 🎉");
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Database connection failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testDatabaseConnection();
