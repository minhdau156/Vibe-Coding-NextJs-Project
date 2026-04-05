import { getItemsByType } from '@/lib/db/items';
import { ItemCard } from '@/components/items/item-card';
import { notFound } from 'next/navigation';
import { FileBox } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface ItemsByTypePageProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function ItemsByTypePage({ params }: ItemsByTypePageProps) {
  const { type } = await params;
  
  // Fetch items corresponding directly to the type string
  const items = await getItemsByType(type);

  // Consider type valid even if 0 items, but maybe fetch the actual type details to get the name/icon.
  // Since we don't have a direct fetch type function by name yet, we can use the first item's type info if available.
  const displayType = items.length > 0 && items[0].itemType 
    ? items[0].itemType.name 
    : type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="capitalize">{displayType}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight capitalize flex items-center gap-3">
          {displayType} Items
        </h1>
        <p className="text-muted-foreground">
          View all items categorized under {displayType.toLowerCase()}.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-muted/20 border-dashed">
          <FileBox className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No {displayType.toLowerCase()} found</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-[300px]">
            You haven't created any items of this type yet. Head back to the dashboard to add some!
          </p>
        </div>
      )}
    </div>
  );
}
