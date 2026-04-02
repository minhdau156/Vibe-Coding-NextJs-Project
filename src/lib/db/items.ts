import { prisma } from "../prisma";

export async function getPinnedItems() {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: "desc" },
    include: {
      itemType: true,
      tags: true,
    },
  });

  return items;
}

export async function getRecentItems(limit: number = 10) {
  const items = await prisma.item.findMany({
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      itemType: true,
      tags: true,
    },
  });

  return items;
}

export async function getItemStats() {
  const total = await prisma.item.count();
  const favorites = await prisma.item.count({
    where: { isFavorite: true },
  });

  return {
    total,
    favorites,
  };
}
