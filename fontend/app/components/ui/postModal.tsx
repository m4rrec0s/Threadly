"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/app/lib/utils";

const PostModal = DialogPrimitive.Root;
const PostModalTrigger = DialogPrimitive.Trigger;
const PostModalPortal = DialogPrimitive.Portal;
const PostModalClose = DialogPrimitive.Close;

const PostModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
PostModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface PostModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title?: string;
  description?: string;
}

const PostModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  PostModalContentProps
>(
  (
    {
      className,
      children,
      title = "Post Details",
      description = "Post Details",
      ...props
    },
    ref
  ) => (
    <PostModalPortal>
      <PostModalOverlay />
      <PostModalClose className="fixed right-4 top-4 opacity-80 transition-opacity hover:opacity-100 focus:outline-none z-[999] cursor-pointer">
        <X className="h-6 w-6 text-white" />
        <span className="sr-only">Close</span>
      </PostModalClose>
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[80vw] h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {/* Sempre incluir um título, mesmo que visualmente oculto */}
        <DialogPrimitive.Title className="sr-only">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          {description}
        </DialogPrimitive.Description>
        {children}
      </DialogPrimitive.Content>
    </PostModalPortal>
  )
);
PostModalContent.displayName = DialogPrimitive.Content.displayName;

const PostModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
PostModalHeader.displayName = "PostModalHeader";

const PostModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
PostModalFooter.displayName = "PostModalFooter";

const PostModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
PostModalTitle.displayName = DialogPrimitive.Title.displayName;

const PostModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
PostModalDescription.displayName = DialogPrimitive.Description.displayName;

export {
  PostModal,
  PostModalPortal,
  PostModalOverlay,
  PostModalClose,
  PostModalTrigger,
  PostModalContent,
  PostModalHeader,
  PostModalFooter,
  PostModalTitle,
  PostModalDescription,
};
