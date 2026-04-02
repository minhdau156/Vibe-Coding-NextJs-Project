import { prisma } from "../prisma";

export async function getRecentCollections(limit: number = 6) {
  const collections = await prisma.collection.findMany({
    take: limit,
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { items: true },
      },
      items: {
        include: {
          item: {
            include: {
              itemType: true,
            },
          },
        },
      },
    },
  });

  return collections.map((c) => {
    const typeCount: Record<string, number> = {};
    const icons = new Map<string, { icon: string; color: string }>();
    let dominantColor = "var(--border)"; // Default fallback color
    let maxCount = 0;

    c.items.forEach((ic) => {
      const type = ic.item.itemType;
      typeCount[type.id] = (typeCount[type.id] || 0) + 1;

      if (typeCount[type.id] > maxCount) {
        maxCount = typeCount[type.id];
        dominantColor = type.color;
      }

      if (!icons.has(type.id)) {
        icons.set(type.id, { icon: type.icon, color: type.color });
      }
    });

    return {
      id: c.id,
      name: c.name,
      description: c.description,
      itemCount: c._count.items,
      updatedAt: c.updatedAt,
      dominantColor,
      itemTypes: Array.from(icons.values()),
    };
  });
}

export async function getCollectionStats() {
  const total = await prisma.collection.count();
  const favorites = await prisma.collection.count({
    where: { isFavorite: true },
  });

  return {
    total,
    favorites,
  };
}

export async function getFavoriteCollections() {
  const collections = await prisma.collection.findMany({
    where: { isFavorite: true },
    orderBy: { updatedAt: "desc" },
  });
  return collections;
}
