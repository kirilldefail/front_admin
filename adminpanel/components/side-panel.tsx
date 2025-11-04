import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from './ui/utils';

interface SidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function SidePanel({ open, onOpenChange, title, description, children, size = 'md' }: SidePanelProps) {
  const widthClass = {
    sm: 'sm:w-[400px]',
    md: 'sm:w-[600px]',
    lg: 'sm:w-[800px]'
  }[size];

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 animate-in fade-in-0" 
            onClick={() => onOpenChange(false)}
          />
          
          {/* Panel */}
          <div className={cn(
            "fixed right-0 top-0 h-full w-full bg-white shadow-lg z-50",
            "flex flex-col animate-in slide-in-from-right duration-300",
            widthClass
          )}>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b">
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{title}</h2>
                {description && (
                  <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="ml-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
