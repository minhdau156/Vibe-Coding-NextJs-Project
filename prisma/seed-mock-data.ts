import { prisma } from '../src/lib/prisma';
import { mockCollections, mockItems, mockUser, mockItemTypes } from '../src/lib/mock-data';

async function main() {
  console.log('Seeding mock data to neon postgres...');

  // Ensure user exists
  const user = await prisma.user.findUnique({
    where: { email: mockUser.email }
  });

  if (!user) {
    console.error('User not found! Please run the main seed first to create the demo user.');
    process.exit(1);
  }

  // Ensure types exist
  const typeMap: Record<string, string> = {};
  for (const t of mockItemTypes) {
    let itemType = await prisma.itemType.findFirst({
      where: { name: t.name, isSystem: true },
    });
    if (!itemType) {
      itemType = await prisma.itemType.create({
        data: { name: t.name, icon: t.icon, color: t.color, isSystem: t.isSystem }
      });
    }
    typeMap[t.name] = itemType.id;
    // Map ID also in case mock items use ID
    typeMap[t.id] = itemType.id; 
  }

  // Create Collections
  const collectionIds: Record<string, string> = {};
  for (const c of mockCollections) {
    const col = await prisma.collection.create({
      data: {
        name: c.name,
        description: c.description,
        isFavorite: c.isFavorite,
        userId: user.id,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }
    });
    collectionIds[c.id] = col.id;
    console.log(`Created collection: ${c.name}`);
  }

  // Create Items
  for (const i of mockItems) {
    // mockItems have itemTypeId like 'type_1', let's map it to real UUID or type object
    const realTypeId = typeMap[i.itemTypeId] || typeMap['type_1']; // default fallback

    const item = await prisma.item.create({
      data: {
        title: i.title,
        description: i.description || '',
        contentType: i.contentType as any,
        content: i.content,
        url: i.url,
        language: i.language,
        isFavorite: i.isFavorite,
        isPinned: i.isPinned,
        itemTypeId: realTypeId,
        userId: user.id,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      }
    });
    
    // To link to collection, we need to know which collection. mockItems don't have collectionId
    // Let's just link it to the first collection we made, or a random one.
    // The prompt says "Create a collection and item to neon postgress base on mock-data.ts"
    // Let's link them to collectionIds[mockCollections[0].id] for simplicity, or spread them.
    const keys = Object.keys(collectionIds);
    const targetColl = keys[Math.floor(Math.random() * keys.length)];
    if(targetColl) {
      await prisma.itemCollection.create({
        data: {
          itemId: item.id,
          collectionId: collectionIds[targetColl],
        }
      });
    }

    console.log(`Created item: ${i.title}`);
  }

  console.log('Finished inserting mock data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
