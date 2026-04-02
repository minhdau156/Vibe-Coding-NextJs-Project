export const dynamic = 'force-dynamic';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getPinnedItems, getRecentItems, getItemStats } from '@/lib/db/items';
import { 
  FileBox, 
  FolderHeart, 
  Star, 
  Library,
  Pin,
  Clock,
  Code, 
  Sparkles, 
  Terminal, 
  StickyNote, 
  File, 
  Image as ImageIcon, 
  Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { getRecentCollections, getCollectionStats } from '@/lib/db/collections';

const IconMap: Record<string, any> = {
  Code, Sparkles, Terminal, StickyNote, File, Image: ImageIcon, Link: LinkIcon
};
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

export default async function DashboardPage() {
  const collectionStats = await getCollectionStats();
  const recentCollections = await getRecentCollections(6);
  const itemStats = await getItemStats();
  const pinnedItems = await getPinnedItems();
  const recentItems = await getRecentItems(10);

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Items" 
          value={itemStats.total} 
          icon={FileBox} 
          description="Stored in your stash"
        />
        <StatCard 
          title="Collections" 
          value={collectionStats.total} 
          icon={Library} 
          description="Organizing your items"
        />
        <StatCard 
          title="Favorite Items" 
          value={itemStats.favorites} 
          icon={Star} 
          description="Quickly accessible items"
        />
        <StatCard 
          title="Favorite Collections" 
          value={collectionStats.favorites} 
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
              {pinnedItems.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {pinnedItems.map(item => {
                    const type = item.itemType;
                    const TypeIcon = IconMap[type?.icon] || FileBox;
                    return (
                      <Link href={`/items/${item.id}`} key={item.id}>
                        <div 
                          className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors h-full"
                          style={{ borderLeftColor: type?.color, borderLeftWidth: '4px' }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{item.title}</span>
                            <TypeIcon className="h-4 w-4 flex-shrink-0" style={{ color: type?.color }} />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                          <div className="flex items-center gap-2 mt-auto pt-2 overflow-hidden">
                            {item.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] truncate">{tag.name}</Badge>
                            ))}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border rounded-lg bg-muted/20 border-dashed">
                  <Pin className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <h3 className="text-sm font-medium">No pinned items</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                    Pin your most important items to access them quickly from the dashboard.
                  </p>
                </div>
              )}
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
                  const type = item.itemType;
                  const TypeIcon = IconMap[type?.icon] || FileBox;
                  return (
                    <Link href={`/items/${item.id}`} key={item.id}>
                      <div className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <TypeIcon className="h-5 w-5" style={{ color: type?.color || '#ccc' }} />
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
                    <div 
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      style={{ borderLeftColor: collection.dominantColor, borderLeftWidth: '4px' }}
                    >
                      <div className="flex flex-col overflow-hidden pr-4 gap-1">
                        <span className="font-medium truncate text-sm">{collection.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground truncate">{collection.itemCount} items</span>
                          {collection.itemTypes.length > 0 && (
                            <div className="flex items-center gap-1 opacity-70 border-l pl-2 border-border">
                              {collection.itemTypes.map((t, i) => {
                                const TypeIcon = IconMap[t.icon] || FileBox;
                                return <TypeIcon key={i} className="h-3 w-3" style={{ color: t.color }} />;
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">{new Date(collection.updatedAt).toLocaleDateString()}</Badge>
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
