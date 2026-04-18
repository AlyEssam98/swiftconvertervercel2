"use client";

import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: any }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
