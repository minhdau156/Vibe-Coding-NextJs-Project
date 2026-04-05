import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { 
  FileBox, 
  Code, 
  Sparkles, 
  Terminal, 
  StickyNote, 
  File, 
  Image as ImageIcon, 
  Link as LinkIcon
} from 'lucide-react';

const IconMap: Record<string, any> = {
  Code, Sparkles, Terminal, StickyNote, File, Image: ImageIcon, Link: LinkIcon
};

// Assuming the basic shape from Prisma's returned include: { itemType: true, tags: true }
export interface ItemWithRelations {
  id: string;
  title: string;
  description: string | null;
  itemType: {
    icon: string;
    color: string;
    name: string;
  } | null;
  tags: {
    id: string;
    name: string;
  }[];
}

interface ItemCardProps {
  item: ItemWithRelations;
}

export function ItemCard({ item }: ItemCardProps) {
  const type = item.itemType;
  const TypeIcon = type && IconMap[type.icon] ? IconMap[type.icon] : FileBox;
  
  return (
    <Link href={`/items/${item.id}`}>
      <div 
        className="flex flex-col gap-2 rounded-lg border bg-card text-card-foreground p-4 hover:bg-muted/50 transition-colors h-full shadow-sm hover:shadow"
        style={{ borderLeftColor: type?.color || 'hsl(var(--primary))', borderLeftWidth: '4px' }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium truncate">{item.title}</span>
          <TypeIcon className="h-4 w-4 shrink-0" style={{ color: type?.color }} />
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-auto pt-2 overflow-hidden">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-[10px] truncate">
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
