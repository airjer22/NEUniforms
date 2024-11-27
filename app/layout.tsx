import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SharedHeader } from '@/components/shared-header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'District Uniform Management System',
  description: 'Efficiently manage school uniform distribution and returns',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SharedHeader />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}