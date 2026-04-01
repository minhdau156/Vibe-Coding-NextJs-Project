import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  mockItems, 
  mockCollections, 
  mockItemTypeCounts, 
  mockItemTypes 
} from '@/lib/mock-data';
import { 
  FileBox, 
  FolderHeart, 
  Star, 
  Library,
  Pin,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

// Stats logic
const totalItems = Object.values(mockItemTypeCounts).reduce((a, b) => a + b, 0);
const totalCollections = mockCollections.length;
const favoriteItemsCount = mockItems.filter(i => i.isFavorite).length;
const favoriteCollectionsCount = mockCollections.filter(c => c.isFavorite).length;

// Items logic
const pinnedItems = mockItems.filter(i => i.isPinned);
const recentItems = [...mockItems].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 10);
const recentCollections = [...mockCollections].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 5);

function StatCard({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: any, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Items" 
          value={totalItems} 
          icon={FileBox} 
          description="Stored in your stash"
        />
        <StatCard 
          title="Collections" 
          value={totalCollections} 
          icon={Library} 
          description="Organizing your items"
        />
        <StatCard 
          title="Favorite Items" 
          value={favoriteItemsCount} 
          icon={Star} 
          description="Quickly accessible items"
        />
        <StatCard 
          title="Favorite Collections" 
          value={favoriteCollectionsCount} 
          icon={FolderHeart} 
          description="Quickly accessible collections"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Left column (Pinned & Recent Items) */}
        <div className="col-span-4 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Pin className="h-5 w-5 text-primary" />
                <CardTitle>Pinned Items</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {pinnedItems.map(item => (
                  <Link href={`/items/${item.id}`} key={item.id}>
                    <div className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors h-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{item.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      <div className="flex items-center gap-2 mt-auto pt-2">
                        {item.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
                {pinnedItems.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pinned items yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Recent Items</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 mt-4">
                {recentItems.map(item => {
                  const type = mockItemTypes.find(t => t.id === item.itemTypeId);
                  return (
                    <Link href={`/items/${item.id}`} key={item.id}>
                      <div className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FileBox className="h-5 w-5" style={{ color: type?.color || '#ccc' }} />
                        </div>
                        <div className="flex flex-1 flex-col overflow-hidden">
                          <span className="font-medium truncate text-sm">{item.title}</span>
                          <span className="text-xs text-muted-foreground truncate capitalize">{type?.name || 'Item'}</span>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.updatedAt.toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column (Recent Collections) */}
        <div className="col-span-3 flex flex-col gap-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Library className="h-5 w-5 text-primary" />
                <CardTitle>Recent Collections</CardTitle>
              </div>
              <CardDescription>Recently updated collections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {recentCollections.map(collection => (
                  <Link href={`/collections/${collection.id}`} key={collection.id}>
                    <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col overflow-hidden pr-4 gap-1">
                        <span className="font-medium truncate text-sm">{collection.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{collection.itemCount} items</span>
                      </div>
                      <Badge variant="outline">{collection.updatedAt.toLocaleDateString()}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
