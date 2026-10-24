"use client";

import { ChatProvider } from "@/contexts/ChatContext";
import { ThemeProvider } from "next-themes"; // useTheme is no longer needed
import React from "react";
import { Toaster } from "sonner";
import Chat from "./Chat";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Updated ThemeProvider to force the dark theme
    <ThemeProvider attribute="class" forcedTheme="dark">
      <ChatProvider>
        {children}
        <Chat />
      </ChatProvider>
      <ToastProvider />
    </ThemeProvider>
  );
}

// This component is now simplified as the theme is always dark.
// It is the only Toaster in the app: sonner renders every toast once per mounted Toaster.
function ToastProvider() {
  return (
    <Toaster
      className="mt-12"
      position="top-right"
      theme="dark" // Hardcoded to "dark"
      richColors
    />
  );
}