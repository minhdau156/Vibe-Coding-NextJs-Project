import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { mockUser, mockItemTypes, mockCollections, mockItems } from '../src/lib/mock-data';

async function main() {
  console.log('Seeding mock data into database...');

  // 1. Upsert Mock User
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: mockUser.email },
    update: {},
    create: {
      email: mockUser.email,
      name: mockUser.name,
      password: hashedPassword,
      isPro: mockUser.isPro,
    },
  });

  // 2. Create System Item Types
  const typeMap: Record<string, string> = {};
  for (const t of mockItemTypes) {
    let itemType = await prisma.itemType.findFirst({
      where: { name: t.name, isSystem: true },
    });

    if (!itemType) {
      itemType = await prisma.itemType.create({
        data: {
          name: t.name,
          icon: t.icon,
          color: t.color,
          isSystem: t.isSystem,
        },
      });
    }
    typeMap[t.id] = itemType.id;
  }

  // 3. Create Collections
  const collMap: Record<string, string> = {};
  for (const c of mockCollections) {
    // Check if collection exists
    let collection = await prisma.collection.findFirst({
      where: { name: c.name, userId: user.id },
    });

    if (!collection) {
      collection = await prisma.collection.create({
        data: {
          name: c.name,
          description: c.description,
          isFavorite: c.isFavorite,
          userId: user.id,
        },
      });
    }
    collMap[c.id] = collection.id;
  }

  // 4. Create Items
  for (const i of mockItems) {
    // Check if item exists
    let item = await prisma.item.findFirst({
      where: { title: i.title, userId: user.id },
    });

    if (!item) {
      item = await prisma.item.create({
        data: {
          title: i.title,
          contentType: i.contentType as "TEXT" | "FILE" | "URL",
          content: i.content,
          url: i.url,
          description: i.description,
          isFavorite: i.isFavorite,
          isPinned: i.isPinned,
          language: i.language,
          userId: user.id,
          itemTypeId: typeMap[i.itemTypeId] || Object.values(typeMap)[0],
        },
      });

      // Assign to a valid collection randomly or map it roughly
      const targetCollKey = Object.keys(collMap)[Math.floor(Math.random() * Object.keys(collMap).length)];
      await prisma.itemCollection.create({
        data: {
          itemId: item.id,
          collectionId: collMap[targetCollKey],
        },
      });
    }
  }

  console.log('Seeded mock data successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
