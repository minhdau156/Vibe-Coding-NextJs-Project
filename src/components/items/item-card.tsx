"use client";

import { useItemDrawer } from "@/components/items/item-drawer-provider";
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
  const { openItem } = useItemDrawer();
  const type = item.itemType;
  const TypeIcon = type && IconMap[type.icon] ? IconMap[type.icon] : FileBox;
  
  return (
    <button 
      onClick={() => openItem(item.id)}
      className="group relative flex flex-col gap-3 rounded-xl border border-border/50 bg-background p-4 text-left shadow-sm transition-all hover:bg-accent/5 hover:shadow-md hover:border-border/80"
    >
      <div className="flex w-full items-start gap-3">
        <div 
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${type?.color || 'hsl(var(--primary))'}15`, color: type?.color || 'hsl(var(--primary))' }}
        >
          <TypeIcon className="h-5 w-5" />
        </div>
        <div className="flex flex-col flex-1 gap-1 overflow-hidden mt-0.5">
          <span className="font-semibold text-sm truncate text-foreground leading-none">{item.title}</span>
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
          )}
        </div>
      </div>
      
      {item.tags && item.tags.length > 0 && (
        <div className="flex w-full flex-wrap items-center gap-1.5 mt-1 border-t border-border/40 pt-3">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-[10px] font-medium px-1.5 py-0 rounded-md bg-secondary text-secondary-foreground">
              {tag.name}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground ml-1">+{item.tags.length - 3}</span>
          )}
        </div>
      )}
    </button>
  );
}
