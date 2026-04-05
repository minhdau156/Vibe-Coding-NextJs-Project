"use client";

import React from "react";
import { useItemDrawer } from "./item-drawer-provider";

export function ItemDrawerTrigger({ itemId, children, className }: { itemId: string, children: React.ReactNode, className?: string }) {
  const { openItem } = useItemDrawer();
  return (
    <div 
      onClick={() => openItem(itemId)} 
      className={`cursor-pointer ${className || ''}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openItem(itemId);
        }
      }}
    >
      {children}
    </div>
  );
}
