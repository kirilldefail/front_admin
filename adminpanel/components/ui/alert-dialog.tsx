"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "./utils";
import { buttonVariants } from "./button";

interface AlertDialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextValue>({
  open: false,
  setOpen: () => {},
});

function AlertDialog({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = onOpenChange || setUncontrolledOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({
  children,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { setOpen } = React.useContext(AlertDialogContext);
  
  return (
    <button
      onClick={(e) => {
        setOpen(true);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function AlertDialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, setOpen } = React.useContext(AlertDialogContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <AlertDialogOverlay onClick={() => setOpen(false)} />
      <div
        role="alertdialog"
        className={cn(
          "bg-background relative z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { setOpen } = React.useContext(AlertDialogContext);
  
  return (
    <button
      className={cn(buttonVariants(), className)}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { setOpen } = React.useContext(AlertDialogContext);
  
  return (
    <button
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
