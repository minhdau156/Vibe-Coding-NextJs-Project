"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Star, Pin, Copy, Edit, Trash, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItemContextType {
  openItem: (id: string) => void;
  closeItem: () => void;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function useItemDrawer() {
  const context = useContext(ItemContext);
  if (!context) throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  return context;
}

export function ItemDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<any>(null);

  const openItem = async (id: string) => {
    setSelectedId(id);
    setOpen(true);
    setLoading(true);
    setItem(null);
    try {
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeItem = () => {
    setOpen(false);
    setTimeout(() => {
      setSelectedId(null);
      setItem(null);
    }, 300); // clear after animation
  };

  return (
    <ItemContext.Provider value={{ openItem, closeItem }}>
      {children}
      <Sheet open={open} onOpenChange={(val) => { if (!val) closeItem(); }}>
        <SheetContent className="sm:max-w-md md:max-w-xl overflow-hidden flex flex-col p-0 border-l border-border/40 bg-background/95 backdrop-blur-xl">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground p-6">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="font-medium animate-pulse">Loading details...</p>
            </div>
          )}
          
          {!loading && item && (
            <div className="flex flex-col h-full overflow-hidden">
               <div className="p-6 pb-0 flex-shrink-0">
                 <SheetHeader className="mb-4 text-left">
                   <div className="flex flex-col gap-3 pr-8">
                     <div>
                       <Badge 
                         variant="outline" 
                         className="capitalize text-xs font-semibold px-2.5 py-0.5 rounded-full border-primary/20 bg-primary/5 text-primary"
                       >
                         {item.itemType?.name || "Item"}
                       </Badge>
                     </div>
                     <SheetTitle className="text-2xl font-bold tracking-tight break-words">{item.title}</SheetTitle>
                   </div>
                   
                   <div className="flex items-center mt-3">
                     <div className="flex items-center gap-0.5 bg-muted/40 p-1 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm">
                       <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg hover:bg-background ${item.isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                         <Star className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background text-muted-foreground">
                         <Pin className="h-4 w-4" />
                       </Button>
                       <div className="w-[1px] h-4 bg-border/60 mx-1"></div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background text-muted-foreground">
                         <Copy className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background text-muted-foreground">
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                         <Trash className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>

                   {item.description && (
                     <SheetDescription className="text-sm mt-4 text-muted-foreground leading-relaxed text-left">
                       {item.description}
                     </SheetDescription>
                   )}
                 </SheetHeader>
               </div>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2">
                 {item.tags && item.tags.length > 0 && (
                   <div className="flex flex-wrap gap-1.5 mb-6 pb-6 border-b border-border/40">
                     {item.tags.map((tag: any) => (
                       <Badge key={tag.id} variant="secondary" className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-default">
                         {tag.name}
                       </Badge>
                     ))}
                   </div>
                 )}

                 {item.content && (
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">Content</h3>
                     </div>
                     <div className="relative group">
                       <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl rounded-bl-none rounded-br-none pointer-events-none opacity-50 dark:opacity-20" />
                       <div className="bg-[#121212] dark:bg-[#0c0c0c] border border-border/60 rounded-xl p-5 text-[13px] font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto shadow-sm text-gray-200">
                         {item.content}
                       </div>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <Copy className="h-3.5 w-3.5" />
                       </Button>
                     </div>
                   </div>
                 )}

                 {item.url && (
                   <div className="space-y-3 mt-6">
                     <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans">Link</h3>
                     <a 
                       href={item.url} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="group flex items-center gap-3 bg-muted/30 border border-border/50 rounded-xl p-3 text-sm text-foreground hover:bg-muted/60 transition-all duration-200"
                     >
                       <div className="bg-background p-2 rounded-lg border border-border/50 group-hover:border-primary/30 transition-colors">
                         <Pin className="h-4 w-4 text-primary" />
                       </div>
                       <span className="truncate flex-1 group-hover:text-primary transition-colors">{item.url}</span>
                     </a>
                   </div>
                 )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ItemContext.Provider>
  );
}
